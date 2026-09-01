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
from typing import List

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
    "also", "just", "than", "too", "very", "s", "t", "now", "using",
    "use", "used", "including", "within", "across", "such", "while",
    "ensure", "work", "working", "worked", "various", "well", "new",
    "based", "responsible", "key", "role", "team", "experience", "years",
    "year", "position", "skills", "ability", "knowledge", "strong",
    "excellent", "good", "proven", "track", "record", "seeking",
    "looking", "apply", "contribute", "support", "help", "assist",
    "develop", "developed", "developing", "build", "building", "built",
    "create", "created", "creating", "manage", "managed", "managing",
    "lead", "led", "leading", "design", "designed", "designing",
    "implement", "implemented", "implementing", "provide", "provided",
    "providing", "ensure", "ensuring", "improve", "increase", "reduce",
    "achieved", "achieving", "resulting", "utilising", "utilizing",
    "adept", "oriented", "driven", "focused", "complex", "innovative",
    "overall", "cutting", "edge", "present", "percent",
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
    """Lowercase, split on non-alphanumeric, filter stop words and short tokens."""
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9\+\#]*", text.lower())
    # strip trailing dots/punctuation and filter
    tokens = [t.rstrip(".,;:") for t in tokens]
    return [t for t in tokens if t not in STOP_WORDS and len(t) > 2]


# ─────────────────────────────────────────────
# SKILLS BLOCK PARSER
# ─────────────────────────────────────────────

def _parse_skills_block(skills_block: str) -> List[str]:
    """
    Extract individual skill terms from the skills block.
    Handles comma-separated, pipe-separated, bullet-separated lists.
    Returns cleaned skill strings (preserving multi-word skills like 'machine learning').
    """
    # split on common delimiters
    raw = re.split(r"[,|•\-\n/]+", skills_block)
    skills = []
    for item in raw:
        item = item.strip().strip(".-").strip()
        if item and len(item) > 1:
            skills.append(item)
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

    for term in _tfidf_keywords(text, top_n=top_n):
        if term not in seen:
            seen.add(term)
            keywords.append(term)

    return keywords[:top_n]