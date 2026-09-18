# ==============================================================================
# FILE: app/services/keyword_extractor.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This file turns a parsed resume (`ParsedResume`, produced by
#   resume_parser.py) into a short, ranked list of search-friendly keywords.
#   Those keywords are what get fed into jsearch_client.py to actually go
#   fetch matching real-world job listings — so the quality of this file's
#   output directly determines how relevant the job matches feel.
#
#   Pipeline position:
#       resume_parser.py  -->  keyword_extractor.py (THIS FILE)  -->  jsearch_client.py  -->  resume_enricher.py
#       (raw resume text      (turn resume into                    (fetch real job          (score resume vs.
#        -> structured           ranked keywords)                    listings using            those jobs)
#        sections)                                                    those keywords)
#
# WHY NO EXTERNAL AI/ML LIBRARY:
#   Everything here is deterministic, local, and dependency-light (plain
#   `re` + `math` + `collections.Counter` — no NLTK, no spaCy, no API
#   calls). This keeps keyword extraction fast, free, and offline-capable.
#
# STRATEGY (see also the module docstring below):
#   1. Explicit skills listed in the resume's "Skills" section are the
#      highest-signal keywords — used first, as-is.
#   2. A lightweight single-document TF-IDF approximation surfaces other
#      important domain terms from the experience/summary/certifications
#      text (and falls back to the full raw text if that's too thin).
#   3. Everything is deduplicated and capped at `top_n` (default 15).
# ==============================================================================

# app/services/keyword_extractor.py
"""
Extracts ranked keywords from a parsed resume.

Strategy (no external AI needed at this phase):
  1. Take skills_block directly — highest signal
  2. Run TF-IDF over the full raw_text to surface domain keywords
  3. Merge + deduplicate, skills_block terms ranked first
"""

import re
import math
from collections import Counter
from typing import List, Set

from app.models.schemas import ParsedResume


# ─────────────────────────────────────────────
# STOP WORDS (lightweight, no NLTK needed)
# ─────────────────────────────────────────────

STOP_WORDS = {
"a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "shall", "can", "that",
    "this", "these", "those", "it", "its", "i", "my", "me", "we", "our",
    "you", "your", "he", "she", "they", "their", "him", "her", "us",
    "which", "who", "whom", "what", "when", "where", "how", "why",
    "all", "any", "each", "every", "both", "few", "more", "most",
    "other", "into", "through", "during", "before", "after", "above",
    "below", "between", "out", "off", "over", "under", "again", "then",
    "once", "here", "there", "not", "no", "nor", "so", "yet", "about",
    "also", "just", "than", "too", "very", "using", "use", "used", 
    "including", "within", "across", "such", "while", "ensure", "work", 
    "working", "worked", "various", "well", "new", "based", "responsible", 
    "key", "role", "team", "experience", "years", "year", "position", 
    "skills", "ability", "knowledge", "strong", "excellent", "good", 
    "proven", "track", "record", "seeking", "looking", "apply", "contribute", 
    "support", "help", "assist", "develop", "developed", "developing", 
    "build", "building", "built", "create", "created", "creating", "manage", 
    "managed", "managing", "lead", "led", "leading", "design", "designed", 
    "designing", "implement", "implemented", "implementing", "provide", 
    "provided", "providing", "ensuring", "improve", "increase", "reduce", 
    "achieved", "achieving", "resulting", "utilising", "utilizing", "adept", 
    "oriented", "driven", "focused", "complex", "innovative", "overall", 
    "cutting", "edge", "present", "percent", "hands", "solving", "both",
    "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
    "summary", "education", "certifications", "languages", "awards", 
    "activities", "information", "additional", "contact", "address", 
    "phone", "email", "website", "technologies", "qualifications", "architecture"
    # months / date noise
    "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep",
    "oct", "nov", "dec", "january", "february", "march", "april",
    "june", "july", "august", "september", "october", "november", "december",
    # resume section words that leak into keywords
    "summary", "education", "certifications", "languages", "awards",
    "activities", "information", "additional", "contact", "address",
    "phone", "email", "website", "technologies", "qualifications",
}


# ─────────────────────────────────────────────
# TOKENIZER
# ─────────────────────────────────────────────
def _tokenize(text: str) -> List[str]:
    """
    Tokenizes text while preserving hyphens, dots, pluses, and hashes inside terms
    (e.g. 'sd-wan', 'ios-xe', 'c++', 'c#', 'node.js').
    """
    # Regex matches words that may contain internal hyphens/dots or trailing +#
    pattern = r"[a-zA-Z0-9]+(?:[-./][a-zA-Z0-9]+)*[+\#]?"
    tokens = re.findall(pattern, text.lower())
    
    clean_tokens = []
    for t in tokens:
        t = t.strip(".,;:/-")
        if len(t) > 1 and t not in STOP_WORDS and not t.isnumeric():
            clean_tokens.append(t)
            
    return clean_tokens

# ─────────────────────────────────────────────
# SKILLS BLOCK PARSER
# ─────────────────────────────────────────────
def _parse_skills_block(skills_block: str) -> List[str]:
    """
    Extracts skill phrases without destroying hyphenated technical terms.
    Splits on newlines, commas, pipes, bullets, or dashes surrounded by spaces.
    """
    # Split on commas, pipes, bullets, newlines, or spaced hyphens (' - ')
    raw = re.split(r"[\n,|•\t\/]+|\s+[-–—]\s+", skills_block)
    skills = []
    
    for item in raw:
        cleaned = item.strip(" .–-•")
        words = cleaned.lower().split()
        
        # Reject empty items, single stop words, or phrases made only of stop words
        if cleaned and len(cleaned) > 1:
            if not all(w in STOP_WORDS for w in words):
                skills.append(cleaned)
                
    return skills


# ─────────────────────────────────────────────
# TF-IDF KEYWORD EXTRACTION
# ─────────────────────────────────────────────

def _tfidf_keywords(text: str, top_n: int = 30) -> List[str]:
    """
    Single-document TF-IDF approximation.
    IDF is approximated using a small hardcoded corpus frequency reference
    so we don't need a full corpus — terms that appear in many resumes
    (e.g. 'experience', 'team') are naturally down-weighted via STOP_WORDS.
    """
    tokens = _tokenize(text)
    if not tokens:
        return []

    total = len(tokens)
    freq = Counter(tokens)

    # TF = count / total tokens
    # We approximate IDF by rewarding less-frequent terms (log-based)
    scored = {}
    for term, count in freq.items():
        tf = count / total
        # Reward rarer terms within the document
        idf = math.log(total / (1 + count))
        scored[term] = tf * idf

    sorted_terms = sorted(scored, key=lambda t: scored[t], reverse=True)
    return sorted_terms[:top_n]


# ─────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────

def extract_keywords(resume: ParsedResume, top_n: int = 15) -> List[str]:
    """
    PUBLIC ENTRY POINT — this is the function other files (e.g. the route/
    controller that orchestrates the parse -> keywords -> jobs -> enrich
    flow) actually call.

    Returns a ranked list of keywords to use as Jsearch search terms.

    Priority order:
      1. Skills block terms (explicit, high signal)
      2. TF-IDF keywords from experience + summary blocks
      3. Fallback to full raw_text TF-IDF

    Returns at most `top_n` keywords, deduplicated.
    """
    seen = set()
    keywords: List[str] = []

    # ── Tier 1: skills block ──────────────────
    if resume.skills_block:
        for skill in _parse_skills_block(resume.skills_block):
            key = skill.lower()
            if key not in seen:
                seen.add(key)
                keywords.append(skill)

    # ── Tier 2: TF-IDF from experience + summary ──
    rich_text = " ".join(filter(None, [
        resume.experience_block,
        resume.summary_block,
        resume.certifications_block,
    ]))
    if rich_text:
        for term in _tfidf_keywords(rich_text, top_n=20):
            if term not in seen:
                seen.add(term)
                keywords.append(term)

    # ── Tier 3: fallback to full raw_text ────
    if len(keywords) < 5:
        for term in _tfidf_keywords(resume.raw_text, top_n=20):
            if term not in seen:
                seen.add(term)
                keywords.append(term)

    return keywords[:top_n]


# ─────────────────────────────────────────────
# JD-SPECIFIC NOISE WORDS
# ─────────────────────────────────────────────
# Unlike STOP_WORDS above (tuned for RESUMES, which use past-tense verbs
# and rarely repeat section headers), job POSTINGS have their own noise
# profile: present-tense imperative bullet verbs ("Configure and maintain
# network hardware") and generic role/section nouns ("Job Description",
# "Roles and Responsibilities"). A single-document TF-IDF pass can't tell
# these apart from real skills because they're often statistically "rare"
# within one posting — this list exists specifically to catch what
# rarity-based scoring cannot.
JD_NOISE_WORDS = {
    # generic JD bullet-point verbs (present-tense, imperative)
    "configure", "install", "evaluate", "maintain", "monitor",
    "troubleshoot", "coordinate", "oversee", "perform", "respond",
    "administer", "review", "deploy", "resolve", "diagnose", "execute",
    "deliver", "drive", "participate", "conduct", "operate", "inspect",
    "document", "upgrade", "patch", "plan", "handle", "prepare",
    "collaborate", "communicate", "recommend", "identify", "analyze",
    "assess", "adhere", "comply", "escalate", "report", "attend",
    # generic role / section / posting-metadata nouns
    "description", "role", "roles", "responsibilities", "requirement",
    "requirements", "qualification", "qualifications", "overview",
    "duties", "duty", "benefit", "benefits", "position", "positions",
    "opportunity", "opportunities", "environment", "environments",
    "organization", "organizations", "solution", "solutions", "company",
    "companies", "department", "departments", "industry", "career",
    "careers", "candidate", "candidates", "employer", "employers",
    "employment", "applicant", "applicants", "engineer", "engineers",
    "specialist", "specialists", "professional", "professionals",
    "level", "levels", "member", "members", "staff", "personnel",
    "individual", "individuals", "someone", "ideal", "job", "jobs",
    "location", "locations", "schedule", "shift", "hours", "salary",
    "compensation", "eeo", "employer", "disability", "veteran",
    "join", "seeking", "required", "preferred", "including",
    "our", "team", "understanding", "solid", "new",
    "and", "product", "growth", "learn",
    # generic marketing/filler adjectives common in postings — these
    # will never be a complete list (see the note on
    # extract_skill_terms_from_posting's backfill tier below for why
    # relying on the TF-IDF backfill tier less, not just growing this
    # list, is the more durable fix)
    "growth", "high", "low", "one", "two", "three", "clients", "client",
    "quality", "fast", "great", "best", "world", "global", "various",
    "wide", "valued", "valuable", "exciting", "perfect", "rapidly",
    "growing", "dynamic", "passionate", "talented", "diverse",
    "fastest", "largest", "biggest", "leading", "leader",
}

# ─────────────────────────────────────────────
# KNOWN SKILL VOCABULARY
# ─────────────────────────────────────────────
# The positive signal the resume-side STOP_WORDS/TF-IDF approach never
# had: an explicit allowlist of real skill/technology/certification
# terms. A term matching this list against the posting text is treated
# as a skill with no statistics involved — this is deliberately checked
# BEFORE the TF-IDF backfill in extract_skill_terms_from_posting(), since
# an allowlist hit is a much stronger signal than "this word is rare in
# this one document."
#
# This is a starting vocabulary, not an exhaustive one — it will always
# lag behind niche/emerging tools. Treat additions here the same as
# adding a new supported category: cheap, low-risk, and the fastest way
# to fix "why didn't it catch X" bug reports as they come in. The longer
# -term fix for full generality is swapping this allowlist match for an
# embedding-similarity check (you already have sentence-transformers in
# requirements.txt) — see the note at the bottom of this file.
KNOWN_SKILL_TERMS = {
    # networking / IT infrastructure
    "tcp/ip", "dns", "dhcp", "vpn", "lan", "wan", "vlan", "bgp", "ospf",
    "firewall", "router", "routers", "switch", "switches", "routing",
    "switching", "cabling", "network security", "wireshark", "snmp",
    "cisco", "juniper", "fortinet", "palo alto", "ccna", "ccnp", "ccie",
    "network engineering", "load balancing", "network monitoring",
    "sd-wan", "mpls", "voip", "active directory", "windows server",
    # programming / web
    "python", "javascript", "typescript", "java", "c++", "c#", "golang",
    "ruby", "php", "rust", "react", "vue", "angular", "node.js", "html",
    "css", "rest api", "graphql", "fastapi", "django", "flask",
    # cloud / devops
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform",
    "devops", "linux", "jenkins", "ansible", "bash",
    # data
    "sql", "excel", "tableau", "power bi", "pandas", "data analysis",
    "data analytics", "postgresql", "mysql", "mongodb", "nosql",
    # ml / ai
    "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
    "bert", "scikit-learn", "artificial intelligence",
    # security
    "cybersecurity", "penetration testing", "owasp", "encryption", "soc",
    "compliance", "cissp", "comptia security+", "siem", "incident response",
    "vulnerability assessment", "risk assessment",
    # project management / business
    "project management", "agile", "scrum", "kanban", "jira", "pmp",
    "stakeholder management", "budget management", "vendor management",
    # design
    "figma", "sketch", "ux", "ui", "wireframing", "prototyping", "adobe",
    # certifications (generic patterns handled separately, common ones here)
    "aws certified", "microsoft certified", "itil",
}


def extract_skill_terms_from_posting(
    text: str,
    top_n: int = 20,
    min_terms: int = 0,
    exclude_terms: "set[str] | None" = None,
) -> List[str]:
    """
    PRECISION-oriented skill extraction for JOB POSTINGS specifically —
    used to build the discrete "Required / Optional" skill-gap checklist
    the user reads directly on their dashboard.

    This is deliberately a SEPARATE function from extract_keywords_from_text()
    rather than a shared one, because the two callers have different
    correctness requirements:

      - extract_keywords_from_text() feeds a JSearch/Adzuna search query.
        A stray noise word there just makes the search marginally less
        precise — the user never sees the noise directly. Recall matters
        more than precision.
      - This function feeds a list the user reads as "your required
        skills for this role." A stray noise word here is a visible,
        confusing product bug. Precision matters more than recall.

    Strategy (allowlist-first, not blocklist-only):
      1. Vocabulary match (KNOWN_SKILL_TERMS) — the positive signal.
         Any known skill term found in the text is included, no
         statistics involved. This is what plain TF-IDF/rarity-based
         extraction structurally cannot do: it has no notion of "this
         IS a skill," only "this word is uncommon in this document."
      2. Bullet/comma-separated short phrases (JD requirement lists read
         a lot like resume skills blocks), filtered through JD_NOISE_WORDS
         and exclude_terms.
      3. Statistical TF-IDF backfill — ONLY to top up the list if steps
         1–2 don't reach top_n, and only after the same noise/exclude
         filtering. Never the primary signal.

    Args:
        text: the job posting's raw description text.
        top_n: HARD CAP on terms returned — never exceeded.
         min_terms: optional floor for the statistical backfill tier (step 3).
            The default is 0, which disables statistical guesses for the
            user-facing skill-gap list. Raise it only when recall for
            unfamiliar skills is more important than precision.
        exclude_terms: tokens to always exclude — pass the job's own
            title + company name here, tokenized, so e.g. "Solutions"
            from "SIGINT Solutions, LLC" can never be reported as a
            required skill of that same job.
    """
    if not text:
        return []

    def _normalize(word: str) -> str:
        """
        Lightweight singularization used ONLY for membership checks
        against JD_NOISE_WORDS / exclude_terms (never for display or for
        what actually gets returned) — just enough to catch "firewalls"
        against a vocabulary/exclude entry of "firewall", or "networks"
        against an excluded "network", without pulling in a real stemming
        library for what is a small, cheap check.
        """
        if len(word) > 3 and word.endswith("s") and not word.endswith("ss"):
            return word[:-1]
        return word

    exclude = {t.lower() for t in (exclude_terms or set())}
    lower_text = text.lower()

    seen: set[str] = set()
    results: List[str] = []
    # Tracks normalized (singularized) sub-words already returned, so we
    # don't show both "Router" and "Routers", or both "Tcp" and "Tcp/Ip"
    # — same underlying skill, just different surface forms picked up by
    # different passes (vocabulary vs. bullet-parsing vs. TF-IDF backfill).
    seen_words: set[str] = set()

    def _word_blocked(word: str) -> bool:
        norm = _normalize(word)
        return (
            word in exclude or norm in exclude
            or word in JD_NOISE_WORDS or norm in JD_NOISE_WORDS
        )

    def _sub_words(key: str) -> list[str]:
        return re.findall(r"[a-z0-9]+", key)

    def _eligible(key: str) -> bool:
        if key in seen:
            return False
        words = _sub_words(key)
        if not words:
            return False
        # Check every constituent word, not just the whole phrase — a
        # multi-word candidate like "Maintain TCP" must be rejected
        # because "maintain" is noise, even though "maintain tcp" as a
        # whole string isn't itself in JD_NOISE_WORDS.
        if any(_word_blocked(w) for w in words):
            return False
        # Already represented by an earlier, equally-or-more-specific
        # match (e.g. "tcp" after "tcp/ip" already matched; "routers"
        # after "router" already matched).
        if all(_normalize(w) in seen_words for w in words):
            return False
        return True

    def _mark_seen(key: str) -> None:
        seen.add(key)
        for w in _sub_words(key):
            seen_words.add(_normalize(w))

    def _vocab_eligible(term: str) -> bool:
        """
        Eligibility check for TIER 1 (vocabulary matches) only —
        deliberately does NOT apply exclude_terms, unlike _eligible()
        below which tiers 2/3 use.

        Why: exclude_terms exists to strip the job's own title/company
        metadata out of the LOW-confidence candidate pool (bullet
        fragments, statistical guesses) where that metadata is noise —
        e.g. "Engineer" from "Network Engineer", "Solutions" from
        "SIGINT Solutions, LLC". But a vocabulary match is a HIGH-
        confidence, deliberate signal: if the job title is "Senior
        Backend Developer (Python)", the word "Python" appearing in the
        title isn't noise — it's the single most important word in that
        title. Applying exclude_terms here would silently drop the most
        obviously-required skill from the list whenever it happens to
        also appear in the job title, which is common and not a
        coincidence worth filtering out.
        """
        if term in seen:
            return False
        words = _sub_words(term)
        if not words:
            return False
        if any(w in JD_NOISE_WORDS for w in words):
            return False
        if all(_normalize(w) in seen_words for w in words):
            return False
        return True

    # ── 1. Vocabulary-first pass — the positive signal ──────────────────
    for term in KNOWN_SKILL_TERMS:
        if not _vocab_eligible(term):
            continue
        # Allow an optional trailing "s" for single-word terms so
        # "firewall" in the vocabulary still matches "firewalls" in the
        # text, without needing to hand-list every plural.
        pattern = re.escape(term)
        if " " not in term and not term.endswith("s"):
            pattern += "s?"
        if re.search(rf"\b{pattern}\b", lower_text):
            _mark_seen(term)
            results.append(term)

    # ── 2. Bullet/comma-separated short phrases ─────────────────────────
    for item in _parse_skills_block(text):
        if not (1 < len(item) <= 40):
            continue
        key = item.lower()
        # Real skill phrases are short (1-3 words). Longer items are
        # sentence fragments the paragraph-splitting picked up (e.g. "LLC
        # is seeking a Network Engineer") — not skills, discard them here
        # rather than trying to noise-filter every possible sentence.
        if len(key.split()) > 3:
            continue
        if _eligible(key):
            _mark_seen(key)
            results.append(item)

    # ── 3. Statistical backfill — only up to min_terms, not top_n ───────
    # This is the key precision/recall trade-off in this function: we'd
    # rather return fewer, trustworthy skills than pad out to top_n with
    # statistical guesses once the high-confidence tiers run dry.
    if len(results) < min_terms:
        for term in _tfidf_keywords(text, top_n=top_n * 3):
            if len(results) >= min_terms:
                break
            if _eligible(term):
                _mark_seen(term)
                results.append(term)

    # Title-case lowercase tokens for display; leave mixed-case terms
    # (e.g. "TCP/IP", "PostgreSQL") exactly as written.
    return [t.title() if t.islower() else t for t in results[:top_n]]


# NOTE on further generalizing KNOWN_SKILL_TERMS:
# A hardcoded vocabulary will always lag behind niche tools/industries
# not covered above (e.g. specialized medical, legal, or trades
# terminology). Since this project already depends on
# sentence-transformers (see requirements.txt), the natural next
# iteration — once this allowlist approach proves out — is to replace
# the vocabulary *match* with a vocabulary *similarity* check: embed
# each TF-IDF candidate term and compare it against embeddings of a
# small set of "this is a skill" example phrases, keeping candidates
# above a similarity threshold instead of requiring an exact string
# match. That generalizes across industries without hand-listing every
# term, at the cost of needing the model loaded (see BERT/NLP layer
# discussion in the project's backend architecture notes). Don't reach
# for that yet — validate the simpler allowlist fixes the reported bug
# first, then decide if coverage gaps justify the added complexity.

def _single_doc_keyword_rank(text: str, top_n: int = 30) -> List[str]:
    """
    Single-document frequency rank with sub-linear TF scaling.
    Avoids inverted IDF penalties on repeated high-value terms.
    """
    tokens = _tokenize(text)
    if not tokens:
        return []

    counts = Counter(tokens)
    
    # Sub-linear term frequency scaling: 1 + log(count)
    # Rewards terms that appear more frequently without over-saturating
    scored = {term: 1 + math.log(count) for term, count in counts.items()}
    sorted_terms = sorted(scored, key=lambda t: scored[t], reverse=True)
    
    return sorted_terms[:top_n]

def extract_keywords_from_text(text: str, top_n: int = 20) -> List[str]:
    """
    Same TF-IDF approximation as extract_keywords(), but for arbitrary
    free text rather than a ParsedResume — used to pull search-friendly
    keywords out of a user-pasted target job description so job matching
    can be steered toward the role they're actually applying for, not
    just what their resume happens to contain.

    Also runs the skills-block-style splitter over the text first (a
    pasted JD's "Requirements"/"Qualifications" bullet lines behave a lot
    like a skills block — comma/bullet separated short phrases), so
    explicit tool/skill names in the JD are prioritized the same way
    they are for resumes.
    """
    if not text:
        return []

    seen: set[str] = set()
    keywords: List[str] = []

    # Bullet/comma-separated lines often contain the highest-signal terms
    # in a JD (e.g. "Requirements: Python, SQL, AWS, 5+ years...").
    for item in _parse_skills_block(text):
        # Skip long sentence-like lines — those get picked up by TF-IDF below.
        if 1 < len(item) <= 40:
            key = item.lower()
            if key not in seen:
                seen.add(key)
                keywords.append(item)

    for term in _single_doc_keyword_rank(text, top_n=top_n):
        if term not in seen:
            seen.add(term)
            keywords.append(term)

    return keywords[:top_n]