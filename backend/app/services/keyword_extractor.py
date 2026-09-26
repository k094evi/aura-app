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
#        -> structured           ranked keywords)                    listings)                those jobs)
#        sections)
#
# WHY MOSTLY NO EXTERNAL AI/ML LIBRARY:
#   Everything here is still primarily deterministic, local, and
#   dependency-light (plain `re` + `math` + `collections.Counter` — no
#   NLTK, no spaCy, no live API calls). This keeps keyword extraction fast,
#   free, and mostly offline-capable.
#
#   ONE exception, added deliberately: `extract_skill_terms_from_posting()`
#   (the user-facing "required skills for this role" extractor) now has an
#   optional semantic-similarity tier on top of the rule-based ones, via
#   `app/services/embedding_service.py` (a local BERT-family embedding
#   model, no external API call). It's additive and fails soft — see the
#   "Tier 1.5" section inside that function and the module docstring of
#   embedding_service.py for the full rationale. Every OTHER function in
#   this file is unchanged and remains pure rule-based.
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
import logging
from collections import Counter
from typing import List, Optional, Set

from app.models.schemas import ParsedResume
from app.services import embedding_service

logger = logging.getLogger("aura")


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
# to fix "why didn't it catch X" bug reports as they come in.
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

_KNOWN_SKILL_TERMS_SORTED = sorted(KNOWN_SKILL_TERMS)

# Minimum cosine similarity for a TF-IDF candidate term to be credited as
# matching a KNOWN_SKILL_TERMS entry. Tuned conservatively (high) on
# purpose — this feeds a user-facing "your required skills" list, where
# a false positive is a visible, confusing product bug (same precision
# concern the module docstring of extract_skill_terms_from_posting
# already describes for its other tiers). 0.62 was chosen to comfortably
# catch true synonyms/rewordings ("containerization" vs. "docker",
# "React framework" vs. "react") while rejecting merely-related-topic
# terms ("networking" vs. "firewall") — re-tune here if you see it
# over- or under-matching in practice.
SEMANTIC_SKILL_MATCH_THRESHOLD = 0.62

# How many of the posting's own TF-IDF-ranked candidate terms get
# checked against KNOWN_SKILL_TERMS per call. Keeps the semantic pass
# bounded — this is NOT the same as top_n (the function's overall
# output cap); it's just the candidate pool the semantic tier searches
# within before that cap is applied.
SEMANTIC_CANDIDATE_POOL_SIZE = 40


def _closest_known_skill(candidate: str) -> Optional[str]:
    """
    Returns the KNOWN_SKILL_TERMS entry `candidate` is semantically
    closest to, if that similarity clears SEMANTIC_SKILL_MATCH_THRESHOLD
    — otherwise None.

    This is the embedding-similarity upgrade this file's KNOWN_SKILL_TERMS
    vocabulary always needed: instead of ONLY ever growing by hand, a
    candidate term that means the same thing as an existing entry (e.g.
    "containerization" vs. "docker"/"kubernetes", "React framework" vs.
    "react", "IaC" vs. "terraform") gets credited too, without needing to
    list every synonym/rewording by hand.

    Uses embedding_service.cached_semantic_similarity(), which caches
    each individual term's embedding — so across many postings analyzed
    in the same running process, the ~150 KNOWN_SKILL_TERMS embeddings
    are each computed once (the first time they're compared against
    anything) and reused after that; only the small number of NEW
    candidate terms per posting cost a fresh embedding call.

    Fails soft: any error talking to the embedding model (not installed,
    model failed to load, etc.) is logged and treated as "no semantic
    match" — callers always still get the exact-match/statistical tiers
    they'd have gotten before this function existed.
    """
    best_term, best_score = None, 0.0
    for known in _KNOWN_SKILL_TERMS_SORTED:
        try:
            score = embedding_service.cached_semantic_similarity(candidate, known)
        except Exception as exc:
            logger.warning("Semantic skill match failed for '%s': %s", candidate, exc)
            return None
        if score > best_score:
            best_term, best_score = known, score
    return best_term if best_score >= SEMANTIC_SKILL_MATCH_THRESHOLD else None


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
      1.5. Semantic vocabulary match — same idea as step 1, but catches
         candidate terms that MEAN the same thing as a KNOWN_SKILL_TERMS
         entry without being the same string (see _closest_known_skill).
         Optional/best-effort: no-ops cleanly if the local embedding
         model isn't available on this machine (see
         embedding_service.is_available()), so this tier never turns a
         missing dependency into a broken /api/analyze call.
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

    # ── 1.5. Semantic vocabulary pass — catches synonyms/rewordings the
    #          literal Tier-1 string match misses ("containerization" ~
    #          docker/kubernetes, "React framework" ~ react, "IaC" ~
    #          terraform). Runs over the posting's OWN TF-IDF-ranked
    #          candidate terms (not the full KNOWN_SKILL_TERMS list —
    #          Tier 1 already covers exact matches, so this only adds
    #          NEW signal on top). Applies the same exclude/noise
    #          filtering as tiers 2/3, since this is a softer
    #          (approximate) signal than an exact vocabulary hit, unlike
    #          tier 1 above.
    #
    #          Cleanly skipped (falls straight through to tier 2) if the
    #          local embedding model isn't available on this machine —
    #          see embedding_service.is_available(). The first posting
    #          analyzed after a fresh process start will be a bit slower
    #          here (each of the ~150 KNOWN_SKILL_TERMS gets embedded
    #          and cached the first time it's compared against
    #          anything); every posting after that reuses those cached
    #          embeddings and only pays for its own new candidate terms.
    if embedding_service.is_available():
        for term in _tfidf_keywords(text, top_n=SEMANTIC_CANDIDATE_POOL_SIZE):
            key = term.lower()
            if not _eligible(key):
                continue
            matched_known_term = _closest_known_skill(key)
            if matched_known_term:
                _mark_seen(key)
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


# NOTE on KNOWN_SKILL_TERMS coverage:
# A hardcoded vocabulary will always lag behind niche tools/industries
# not covered above (e.g. specialized medical, legal, or trades
# terminology) — the Tier 1.5 semantic pass above narrows that gap by
# catching terms that MEAN the same thing as an existing entry, but it
# still can't invent a category that has zero related entries in
# KNOWN_SKILL_TERMS to begin with (there's nothing for "specialized
# legal terminology" to be semantically close TO yet). If a whole new
# domain needs supporting, the fastest fix is still the cheap one: add
# a handful of representative terms for that domain to KNOWN_SKILL_TERMS
# — the semantic tier then automatically picks up that domain's
# synonyms/rewordings too, without listing every one of them by hand.

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