# ==============================================================================
# FILE: app/services/resume_enricher.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This is the FINAL and LARGEST step of the pipeline — it's what actually
#   produces the numbers and written feedback the user sees on their
#   dashboard (ATS score, per-dimension bar chart, strengths, improvements,
#   skill gaps, grammar issues).
#
#   Full pipeline:
#       resume_parser.py --> keyword_extractor.py --> jsearch_client.py --> resume_enricher.py (THIS FILE)
#       (bytes -> structured   (structured resume      (keywords -> real     (resume + keywords + real jobs
#        ParsedResume)           -> keywords)             job listings)        -> score + feedback dict)
#
#   As the module docstring below explains, this file is a full local
#   (no external API, no cost) replacement for what used to be a live call
#   to the Claude API — everything here is computed deterministically with
#   plain Python (regex, string ops, arithmetic) from data the earlier
#   pipeline stages already produced.
#
# HOW TO READ THIS FILE (it's long — here's the map):
#   1. SKILL TAXONOMY / constants (top)      — reference data used for
#      scoring and gap-detection (skill categories, impact-language regex
#      patterns, resume-cliché/grammar regex checks).
#   2. DIMENSION SCORERS (_score_keywords, _score_format, _score_skills,
#      _score_impact, _score_length) — each independently scores one
#      aspect of the resume from 0–100. These 5 scores, weighted, become
#      the overall ATS score.
#   3. SHARED HELPERS — small utilities (_sample_skills, _first_line,
#      _extract_impact_examples, _top_job_vocab, _matched_job_terms,
#      _missing_job_terms) used by both the scorers above and the
#      text-generators below, so the written feedback always references
#      the SAME concrete terms/lines the score was actually based on
#      (not generic, disconnected boilerplate).
#   4. TEXT GENERATORS (_generate_strengths, _generate_improvements) —
#      turn the scores + shared helpers into specific, human-readable
#      bullet points quoting the user's actual resume content.
#   5. _detect_skill_gaps — cross-references the resume against both the
#      skill taxonomy and the vocabulary of the user's top-matching job
#      postings to flag which skills are present vs. missing.
#   6. _check_grammar — regex-based style/tone checks (passive voice,
#      first-person pronouns, resume clichés, filler words, etc.).
#   7. enrich_resume_local() — PUBLIC ENTRY POINT. Ties everything above
#      together: runs all 5 dimension scorers, computes the weighted
#      overall ATS score, and returns one dict shaped exactly like the
#      old Claude-API JSON response so nothing downstream (e.g. main.py)
#      needs to change.
#
# WHERE THIS FITS FOR CALLERS:
#   Call `enrich_resume_local(resume, keywords, top_jobs)` with:
#     - resume:   the ParsedResume from resume_parser.parse_resume()
#     - keywords: the list from keyword_extractor.extract_keywords()
#     - top_jobs: shaped/scored job dicts (from jsearch_client + a job
#                 scorer step) — each expected to have at least
#                 "title", "description", and optionally "matched_skills".
# ==============================================================================

# app/services/resume_enricher.py
"""
Local NLP enrichment engine for Aura Resume Analyzer.

Replaces the Claude API call entirely — no external dependencies, no cost.
All scores are computed deterministically from the ParsedResume object
and the keyword/job data already produced by the existing pipeline.

Scoring Architecture
────────────────────
ATS Score (0–100) = weighted average of 5 dimension scores:

  Dimension        Weight   What it measures
  ─────────────    ──────   ────────────────────────────────────────────
  Keywords           25%    Keyword density vs. matched job keywords
  Format             20%    Section completeness (has summary/exp/skills/edu)
  Skills             25%    Skills block coverage & depth
  Impact             20%    Quantified achievements (numbers, %, $, metrics)
  Length             10%    Word count in the optimal 400–800 range

Each dimension score is also surfaced individually in `sections` for the
Dimension Analysis bar chart in the frontend.

Strengths / Improvements
─────────────────────────
These are generated from actual resume content — specific skill names,
real bullet lines containing metrics, and actual terms shared with (or
missing from) the user's top-matching job postings — rather than generic
template sentences, so two different resumes with the same score never
produce identical text.
"""

import re
import math
from typing import Optional

from app.models.schemas import ParsedResume


# ─────────────────────────────────────────────────────────────────────────────
# SKILL TAXONOMY
# Maps broad skill categories → representative keywords.
# Used for skill gap detection: if none of a category's keywords appear in the
# resume's skills_block, we flag it as missing/optional.
# ─────────────────────────────────────────────────────────────────────────────

SKILL_TAXONOMY = {
    "Communication":       ["communication", "presentation", "writing", "verbal", "interpersonal", "negotiation"],
    "Leadership":          ["leadership", "management", "mentoring", "coaching", "team lead", "director", "supervise"],
    "Project Management":  ["project management", "agile", "scrum", "kanban", "jira", "pmp", "planning", "roadmap"],
    "Data Analysis":       ["data analysis", "sql", "excel", "tableau", "power bi", "statistics", "analytics", "pandas"],
    "Programming":         ["python", "javascript", "java", "c++", "typescript", "golang", "ruby", "php", "rust"],
    "Cloud & DevOps":      ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform", "devops", "linux"],
    "Machine Learning":    ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "bert", "scikit", "ai"],
    "Web Development":     ["react", "vue", "angular", "node", "html", "css", "rest", "api", "fastapi", "django"],
    "Design":              ["figma", "sketch", "ux", "ui", "design", "wireframe", "prototype", "adobe"],
    "Soft Skills":         ["problem solving", "critical thinking", "collaboration", "adaptability", "creativity"],
    "Database":            ["postgresql", "mysql", "mongodb", "redis", "database", "orm", "nosql", "sqlite"],
    "Security":            ["cybersecurity", "penetration testing", "owasp", "encryption", "soc", "compliance"],
}

# Minimum skills found in skills_block to consider "Skills" dimension strong
SKILLS_STRONG_THRESHOLD = 6
SKILLS_ADEQUATE_THRESHOLD = 3

# Optimal resume length range (words)
WORD_COUNT_MIN = 400
WORD_COUNT_MAX = 800
WORD_COUNT_IDEAL_LOW = 450
WORD_COUNT_IDEAL_HIGH = 700

# Regex patterns for quantified achievements (numbers, %, $, multipliers)
IMPACT_PATTERNS = [
    r"\b\d+\s*%",                         # "20%", "35 %"
    r"\$\s*\d[\d,\.]*[kKmMbB]?\b",        # "$500K", "$1.2M"
    r"\b\d[\d,]*\s*(users|customers|clients|people|employees|members|projects|products|systems|applications|countries|regions|markets)",
    r"\b(increased|decreased|reduced|improved|grew|boosted|cut|saved|generated|delivered|launched|scaled)\b.{0,40}\b\d+",
    r"\bx\d+\b|\b\d+x\b",                 # "3x", "10x"
    r"\b(led|managed|directed|oversaw)\b.{0,30}\bteam\b.{0,20}\b\d+",
    r"\b\d+\s*(million|billion|thousand|hundred)\b",
]

# Grammar / style anti-patterns
GRAMMAR_CHECKS = [
    {
        "pattern": r"\b(responsible for|in charge of|duties included|tasked with)\b",
        "type": "Passive",
        "text": "Replace weak phrases like 'responsible for' with strong action verbs (led, built, designed, delivered).",
    },
    {
        "pattern": r"\b(is|are|am|was|were)\s+\w+ing\b",
        "type": "Tense",
        "text": "Use simple past tense for past roles — 'developed' not 'was developing'.",
    },
    {
        "pattern": r"\b(i |i'm |i've |i'll )",
        "type": "Clarity",
        "text": "Remove first-person pronouns ('I', 'I've') — resumes are written in implied first person.",
    },
    {
        "pattern": r"(.)\1{3,}",
        "type": "Brevity",
        "text": "Avoid filler or repeated characters — keep every word purposeful.",
    },
    {
        "pattern": r"\b(very|really|quite|rather|somewhat|extremely|incredibly)\s+\w+",
        "type": "Brevity",
        "text": "Cut vague intensifiers ('very', 'really', 'extremely') — use precise, specific language instead.",
    },
    {
        "pattern": r"\b(hardworking|passionate|motivated|enthusiastic|dynamic|results.driven|detail.oriented|self.starter|team player|go.getter)\b",
        "type": "Clarity",
        "text": "Remove resume clichés like 'hardworking' or 'passionate' — show these traits through accomplishments instead.",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# DIMENSION SCORERS
# Each returns a float 0–100.
# ─────────────────────────────────────────────────────────────────────────────

def _score_keywords(
    resume: ParsedResume,
    keywords: list[str],
    top_jobs: list[dict],
) -> float:
    """
    Measures keyword coverage relative to what target jobs demand.

    NOTE: keywords are extracted FROM the resume, so checking whether they
    appear IN the resume is circular and always returns 100%. Instead we
    measure two things that can genuinely be missing:

    1. job_skill_coverage (60% weight)
       The job scorer in job_scorer.py stores `matched_skills` — tokens from
       the job description that overlapped with the resume. But there are also
       skills in each job description that did NOT match. We approximate the
       full required skill set from all top-job descriptions and check what
       fraction the resume actually covers.

    2. keyword_density (40% weight)
       Ratio of unique meaningful keywords to total word count. A keyword-rich
       resume has a high density; one padded with filler prose scores lower.
       Ideal density ≈ 8–15% unique meaningful terms.
    """
    raw = resume.raw_text.lower()
    word_count = max(resume.word_count, 1)

    # ── 1. Job skill coverage: what fraction of job-demanded terms are present ──
    # Collect ALL tokens from top-job titles + descriptions (not just matched ones)
    # These represent what the market expects for this role.
    job_vocab: set[str] = set()
    for job in top_jobs[:10]:
        title_tokens = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("title", "").lower()))
        desc_tokens  = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("description", "").lower()))
        job_vocab |= title_tokens | desc_tokens

    # Remove generic stop words that inflate the denominator
    job_vocab -= _GENERIC_JOB_TERMS

    if job_vocab:
        matched = sum(1 for term in job_vocab if term in raw)
        job_skill_coverage = min(matched / len(job_vocab) * 100, 100)
    else:
        # No job data — fall back to a neutral 50
        job_skill_coverage = 50.0

    # ── 2. Keyword density: unique meaningful terms / total words ─────────────
    # Extract meaningful tokens from the resume (reuse same regex as job_scorer)
    resume_tokens = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", raw)) - _GENERIC_JOB_TERMS
    density = len(resume_tokens) / word_count  # typical range 0.05–0.20

    # Scale: density of 0.12+ = full 100, below 0.04 = near 0
    density_score = min(density / 0.12 * 100, 100)

    return round(job_skill_coverage * 0.60 + density_score * 0.40, 1)


def _score_format(resume: ParsedResume) -> float:
    """
    Measures structural completeness.

    Scoring:
      - Has summary/objective block    → 20 pts
      - Has experience block           → 30 pts
      - Has skills block               → 25 pts
      - Has education block            → 15 pts
      - Has projects or certifications → 10 pts
    Total = 100.
    """
    score = 0.0
    if resume.summary_block and len(resume.summary_block.strip()) > 30:
        score += 20
    if resume.experience_block and len(resume.experience_block.strip()) > 50:
        score += 30
    if resume.skills_block and len(resume.skills_block.strip()) > 20:
        score += 25
    if resume.education_block and len(resume.education_block.strip()) > 20:
        score += 15
    if (resume.projects_block and len(resume.projects_block.strip()) > 20) or \
       (resume.certifications_block and len(resume.certifications_block.strip()) > 20):
        score += 10
    return round(score, 1)


def _score_skills(resume: ParsedResume) -> float:
    """
    Measures skills section depth.

    Scoring:
      - Number of individual skills listed (up to 80 pts, linear up to 12 skills)
      - Breadth across taxonomy categories found in skills_block (up to 20 pts)
    """
    if not resume.skills_block:
        return 10.0  # penalty for missing skills section entirely

    skills_text = resume.skills_block.lower()

    # Count individual skill entries
    parts = re.split(r"[,|•\n/\-]+", skills_text)
    skill_items = [p.strip() for p in parts if p.strip() and len(p.strip()) > 1]
    count_score = min(len(skill_items) / 12, 1.0) * 80

    # Breadth: how many taxonomy categories appear
    categories_hit = 0
    for category, terms in SKILL_TAXONOMY.items():
        if any(term in skills_text for term in terms):
            categories_hit += 1
    breadth_score = min(categories_hit / 4, 1.0) * 20  # 4 categories = full breadth score

    return round(count_score + breadth_score, 1)


def _score_impact(resume: ParsedResume) -> float:
    """
    Measures use of quantified, achievement-oriented language.

    Each unique impact pattern match found in experience/summary = 8 pts.
    Capped at 100.
    """
    text = " ".join(filter(None, [
        resume.experience_block,
        resume.summary_block,
        resume.projects_block,
    ])).lower()

    if not text:
        return 20.0  # base score if no experience text

    hits = 0
    for pattern in IMPACT_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        hits += len(matches)

    # Base of 20, +8 per hit up to 100
    return round(min(20 + hits * 8, 100), 1)


def _score_length(resume: ParsedResume) -> float:
    """
    Word count optimality score.
    Ideal range: 450–700 words = 100 pts.
    Outside that range, score degrades linearly.
    """
    wc = resume.word_count

    if WORD_COUNT_IDEAL_LOW <= wc <= WORD_COUNT_IDEAL_HIGH:
        return 100.0
    elif wc < WORD_COUNT_IDEAL_LOW:
        # Too short — scale from 0 at 0 words to 100 at ideal_low
        return round(max(wc / WORD_COUNT_IDEAL_LOW * 100, 10), 1)
    else:
        # Too long — penalise beyond ideal_high, floor at 40
        excess = wc - WORD_COUNT_IDEAL_HIGH
        return round(max(100 - (excess / 10), 40), 1)


# ─────────────────────────────────────────────────────────────────────────────
# SHARED HELPERS FOR RESUME-SPECIFIC TEXT EXTRACTION
# Used by both keyword scoring and the strength/improvement generators below,
# so strengths/improvements can reference the *same* terms the score is based on.
# ─────────────────────────────────────────────────────────────────────────────

_GENERIC_JOB_TERMS = {
    "the", "and", "for", "with", "this", "that", "are", "you", "will",
    "our", "have", "your", "from", "they", "been", "their", "all",
    "not", "but", "can", "who", "its", "was", "one", "more", "about",
    "into", "such", "also", "any", "some", "work", "must", "well",
    "including", "experience", "skills", "team", "role", "responsibilities",
}


def _sample_skills(skills_block: Optional[str], n: int = 4) -> list[str]:
    """Returns up to n skill names exactly as written in skills_block (deduped, order preserved)."""
    if not skills_block:
        return []
    parts = re.split(r"[,|•\n/\-]+", skills_block)
    items = [p.strip() for p in parts if p.strip() and len(p.strip()) > 1]
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        key = item.lower()
        if key not in seen:
            seen.add(key)
            out.append(item)
        if len(out) >= n:
            break
    return out


def _first_line(block: Optional[str], max_len: int = 90) -> str:
    """Returns the first non-empty line of a section block, truncated for display."""
    if not block:
        return ""
    for line in block.split("\n"):
        line = line.strip(" -•\t")
        if line:
            return line if len(line) <= max_len else line[: max_len - 3].rstrip() + "..."
    return ""


def _extract_impact_examples(text: Optional[str], max_examples: int = 2) -> list[str]:
    """Pulls real lines from the resume that contain quantified achievements."""
    if not text:
        return []
    examples: list[str] = []
    for line in text.split("\n"):
        clean = line.strip(" -•\t")
        if not clean:
            continue
        for pattern in IMPACT_PATTERNS:
            if re.search(pattern, clean, re.IGNORECASE):
                snippet = clean if len(clean) <= 140 else clean[:137].rstrip() + "..."
                if snippet not in examples:
                    examples.append(snippet)
                break
        if len(examples) >= max_examples:
            break
    return examples


def _top_job_vocab(top_jobs: Optional[list[dict]], limit: int = 10) -> set[str]:
    """Aggregate vocabulary from the user's top-matching job titles/descriptions."""
    vocab: set[str] = set()
    for job in (top_jobs or [])[:limit]:
        title_tokens = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("title", "").lower()))
        desc_tokens  = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("description", "").lower()))
        vocab |= title_tokens | desc_tokens
    return vocab - _GENERIC_JOB_TERMS


def _matched_job_terms(resume: ParsedResume, top_jobs: Optional[list[dict]], n: int = 5) -> list[str]:
    """Specific terms that appear BOTH in the resume and across top-matching job postings."""
    vocab = _top_job_vocab(top_jobs)
    if not vocab:
        return []
    raw = resume.raw_text.lower()
    matched = [term for term in vocab if term in raw]
    # Longer/more specific terms are more informative than short generic tokens
    matched.sort(key=len, reverse=True)
    return matched[:n]


def _missing_job_terms(resume: ParsedResume, top_jobs: Optional[list[dict]], n: int = 5) -> list[str]:
    """Terms frequent across top-matching jobs but absent from the resume, ranked by frequency."""
    counts: dict[str, int] = {}
    for job in (top_jobs or [])[:10]:
        title_tokens = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("title", "").lower()))
        desc_tokens  = set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", job.get("description", "").lower()))
        for term in (title_tokens | desc_tokens) - _GENERIC_JOB_TERMS:
            counts[term] = counts.get(term, 0) + 1

    raw = resume.raw_text.lower()
    missing = [(term, c) for term, c in counts.items() if term not in raw and c >= 2]
    missing.sort(key=lambda t: t[1], reverse=True)
    return [term for term, _ in missing[:n]]


# ─────────────────────────────────────────────────────────────────────────────
# STRENGTH GENERATOR
# ─────────────────────────────────────────────────────────────────────────────

def _generate_strengths(
    resume: ParsedResume,
    keywords: list[str],
    kw_score: float,
    skills_score: float,
    impact_score: float,
    format_score: float,
    top_jobs: Optional[list[dict]] = None,
) -> list[str]:
    strengths = []

    # Skills section present and rich — name the actual skills, not just a count
    if resume.skills_block:
        parts = re.split(r"[,|•\n/\-]+", resume.skills_block)
        skill_count = len([p for p in parts if p.strip()])
        sample = _sample_skills(resume.skills_block, n=4)
        sample_str = ", ".join(sample)
        if skill_count >= SKILLS_STRONG_THRESHOLD and sample_str:
            strengths.append(
                f"Strong, specific skills section — {skill_count} listed competencies "
                f"including {sample_str}, giving ATS parsers a clear technical profile."
            )
        elif skill_count >= SKILLS_ADEQUATE_THRESHOLD and sample_str:
            strengths.append(f"Skills section covers core competencies such as {sample_str}.")

    # High keyword match — name the actual terms shared with top-matching jobs
    matched_terms = _matched_job_terms(resume, top_jobs, n=5)
    if kw_score >= 70:
        if matched_terms:
            strengths.append(
                f"Vocabulary aligns with your top-matching job postings — terms like "
                f"{', '.join(matched_terms)} appear in both ({int(kw_score)}% keyword match)."
            )
        else:
            strengths.append(
                f"Resume vocabulary aligns well with job market keywords "
                f"({int(kw_score)}% keyword match) — good ATS discoverability."
            )

    # Quantified impact — quote the actual bullet(s) that contain metrics
    if impact_score >= 60:
        examples = _extract_impact_examples(
            "\n".join(filter(None, [resume.experience_block, resume.projects_block])),
            max_examples=2,
        )
        if examples:
            quoted = " / ".join(f"\"{e}\"" for e in examples)
            strengths.append(
                f"Uses quantified, achievement-oriented language — e.g. {quoted} — "
                "makes your impact concrete and easy to scan."
            )
        else:
            strengths.append(
                "Experience section uses quantified, achievement-oriented language "
                "(numbers, percentages, or metrics detected) — makes impact tangible."
            )

    # All key sections present
    if format_score >= 80:
        strengths.append(
            "Resume structure is complete — summary, experience, skills, and "
            "education sections all detected by the parser."
        )

    # Education present — reference the actual line
    if resume.education_block:
        edu_preview = _first_line(resume.education_block)
        if edu_preview:
            strengths.append(f"Education section is clearly structured, e.g. \"{edu_preview}\".")
        else:
            strengths.append("Education section is present and clearly structured.")

    # Projects bonus — reference the actual project
    if resume.projects_block:
        proj_preview = _first_line(resume.projects_block)
        if proj_preview:
            strengths.append(
                f"Projects section adds concrete proof of skills beyond job titles, "
                f"e.g. \"{proj_preview}\"."
            )
        else:
            strengths.append("Projects section adds concrete proof of skills beyond job titles.")

    # Certifications bonus — reference the actual certification
    if resume.certifications_block:
        cert_preview = _first_line(resume.certifications_block)
        if cert_preview:
            strengths.append(
                f"Certifications signal professional development commitment, "
                f"e.g. \"{cert_preview}\"."
            )
        else:
            strengths.append("Certifications section signals professional development commitment.")

    # Word count in good range
    if WORD_COUNT_IDEAL_LOW <= resume.word_count <= WORD_COUNT_IDEAL_HIGH:
        strengths.append(
            f"Resume length ({resume.word_count} words) is in the optimal "
            "450–700 word range for ATS parsing and human readability."
        )

    # Return up to 4 strongest, always at least 2
    if not strengths:
        strengths = [
            "Resume was successfully parsed — content is machine-readable.",
            "File format is compatible with standard ATS systems.",
        ]

    return strengths[:4]


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVEMENT GENERATOR
# ─────────────────────────────────────────────────────────────────────────────

def _generate_improvements(
    resume: ParsedResume,
    kw_score: float,
    skills_score: float,
    impact_score: float,
    format_score: float,
    length_score: float,
    top_jobs: Optional[list[dict]] = None,
) -> list[str]:
    improvements = []

    # Missing or thin sections
    if not resume.summary_block:
        improvements.append(
            "Add a 2–3 sentence professional summary at the top — "
            "ATS systems use it to classify your profile before reading further."
        )
    if not resume.skills_block:
        improvements.append(
            "Add a dedicated Skills section listing tools, languages, and frameworks — "
            "it's the highest-signal section for ATS keyword matching."
        )

    # Low impact score — point at an actual bullet lacking a metric
    if impact_score < 50:
        weak_bullet = _first_line(resume.experience_block)
        if weak_bullet:
            improvements.append(
                f"Add measurable results to bullets like \"{weak_bullet}\" — "
                "specify numbers, percentages, or scale (e.g., 'reduced load time by 40%', "
                "'led a team of 8') to make the accomplishment concrete."
            )
        else:
            improvements.append(
                "Add quantified achievements to your experience bullets "
                "(e.g., 'Reduced load time by 40%', 'Led team of 8') — "
                "numbers make accomplishments concrete and memorable."
            )

    # Low keyword score — name the actual missing terms from top-matching jobs
    if kw_score < 60:
        missing_terms = _missing_job_terms(resume, top_jobs, n=5)
        if missing_terms:
            improvements.append(
                f"Consider adding these terms if they apply to your experience: "
                f"{', '.join(missing_terms)} — they appear frequently in your top-matching "
                "job postings but not in your resume."
            )
        else:
            improvements.append(
                "Incorporate more industry-specific keywords from target job postings — "
                "mirror their exact phrasing where truthful to improve ATS match rate."
            )

    # Too short
    if resume.word_count < WORD_COUNT_MIN:
        improvements.append(
            f"Resume is short ({resume.word_count} words) — expand experience "
            "descriptions with specific accomplishments to reach the 450–700 word sweet spot."
        )
    # Too long
    elif resume.word_count > WORD_COUNT_MAX:
        improvements.append(
            f"Resume is long ({resume.word_count} words) — trim older or less relevant "
            "roles to keep it focused; aim for 450–700 words."
        )

    # No projects or certifications
    if not resume.projects_block and not resume.certifications_block:
        improvements.append(
            "Add a Projects or Certifications section to demonstrate applied "
            "skills beyond your job history."
        )

    # Low skills score
    if skills_score < 50:
        improvements.append(
            "Expand your Skills section — list specific tools, frameworks, "
            "and technologies relevant to your target role."
        )

    # Fallback
    if not improvements:
        improvements = [
            "Tailor your summary and skills section keywords to each specific job posting.",
            "Ensure consistent date formatting throughout experience entries.",
        ]

    return improvements[:4]


# ─────────────────────────────────────────────────────────────────────────────
# SKILL GAP DETECTOR
# ─────────────────────────────────────────────────────────────────────────────

def _detect_skill_gaps(
    resume: ParsedResume,
    top_jobs: list[dict],
) -> list[dict]:
    """
    Cross-references the resume's skills_block against:
      1. The SKILL_TAXONOMY to identify category-level gaps
      2. The matched_skills from top jobs to surface role-specific gaps

    Returns a list of dicts matching the frontend SkillGap shape:
      { skill, missing (bool), recommendation }

    missing=False → skill IS present (shown green as "REQUIRED" met)
    missing=True  → skill is NOT present (shown orange as "OPTIONAL" / gap)
    """
    resume_text = (resume.raw_text or "").lower()
    skills_text = (resume.skills_block or "").lower()

    results: list[dict] = []
    seen: set[str] = set()

    # ── Step 1: top job matched_skills (highest priority — role-specific) ──
    job_skill_counts: dict[str, int] = {}
    for job in top_jobs[:10]:
        for skill in job.get("matched_skills", []):
            s = skill.lower().strip()
            if s:
                job_skill_counts[s] = job_skill_counts.get(s, 0) + 1

    # Sort by frequency — most common across top jobs first
    top_job_skills = sorted(job_skill_counts, key=lambda s: job_skill_counts[s], reverse=True)

    for skill in top_job_skills[:6]:
        if skill in seen:
            continue
        seen.add(skill)
        present = skill in resume_text
        results.append({
            "skill": skill.title(),
            "missing": not present,
            "recommendation": (
                f"Already detected in your resume."
                if present else
                f"Appears in {job_skill_counts[skill]} of your top job matches — "
                f"add it if applicable to your experience."
            ),
        })

    # ── Step 2: taxonomy categories to fill up to 6 items ──
    for category, terms in SKILL_TAXONOMY.items():
        if len(results) >= 6:
            break
        if category in seen:
            continue

        # Check if any term from this category appears in skills_block or resume
        present_in_skills = any(t in skills_text for t in terms)
        present_in_resume = any(t in resume_text for t in terms)

        # Only surface gaps (not present at all) or strengths (in skills block)
        if present_in_skills:
            seen.add(category)
            results.append({
                "skill": category,
                "missing": False,
                "recommendation": f"Evident in your skills section — good coverage.",
            })
        elif not present_in_resume:
            seen.add(category)
            results.append({
                "skill": category,
                "missing": True,
                "recommendation": (
                    f"Not detected in your resume — consider adding relevant "
                    f"{category.lower()} skills if applicable to your target role."
                ),
            })

    return results[:6]


# ─────────────────────────────────────────────────────────────────────────────
# GRAMMAR / STYLE CHECKER
# ─────────────────────────────────────────────────────────────────────────────

def _check_grammar(resume: ParsedResume) -> list[dict]:
    """
    Runs regex-based style checks on the full resume text.
    Returns up to 4 issues, deduped by type (one per type).
    """
    text = resume.raw_text.lower()
    issues: list[dict] = []
    seen_types: set[str] = set()

    for check in GRAMMAR_CHECKS:
        if check["type"] in seen_types:
            continue
        if re.search(check["pattern"], text, re.IGNORECASE):
            issues.append({
                "type": check["type"],
                "text": check["text"],
            })
            seen_types.add(check["type"])

        if len(issues) >= 4:
            break

    # If no issues found, return a positive note
    if not issues:
        issues = [{
            "type": "Style",
            "text": "No major style issues detected — resume reads clearly and professionally.",
        }]

    return issues


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API — drop-in replacement for _enrich_with_ai()
# ─────────────────────────────────────────────────────────────────────────────

def enrich_resume_local(
    resume: ParsedResume,
    keywords: list[str],
    top_jobs: list[dict],
) -> dict:
    """
    PUBLIC ENTRY POINT for this file — this is the only function other
    modules need to call; everything above it is internal implementation
    detail feeding into this function.

    Computes all dashboard enrichment data locally from the ParsedResume.
    Returns a dict with the exact same shape as the old Claude JSON response,
    so main.py needs zero changes to the return block.

    Args:
        resume:    ParsedResume object from resume_parser.parse_resume()
        keywords:  list of extracted keyword strings from keyword_extractor
        top_jobs:  list of shaped job dicts (already scored by job_scorer)

    Returns:
        {
            ats_score:      int 0–100,
            sections:       [{ name, value }] × 5,
            strengths:      [str] × 3–4,
            improvements:   [str] × 3–4,
            skill_gaps:     [{ skill, missing, recommendation }] × ≤6,
            grammar_issues: [{ type, text }] × ≤4,
        }
    """
    # ── Compute dimension scores ──────────────────────────────────────────────
    kw_score     = _score_keywords(resume, keywords, top_jobs)
    format_score = _score_format(resume)
    skills_score = _score_skills(resume)
    impact_score = _score_impact(resume)
    length_score = _score_length(resume)

    # ── ATS Score: weighted average ───────────────────────────────────────────
    ats_score = round(
        kw_score     * 0.25 +
        format_score * 0.20 +
        skills_score * 0.25 +
        impact_score * 0.20 +
        length_score * 0.10
    )
    # Clamp to valid range
    ats_score = max(0, min(100, ats_score))

    # ── Build output ─────────────────────────────────────────────────────────
    return {
        "ats_score": ats_score,
        "sections": [
            {"name": "Keywords", "value": int(kw_score)},
            {"name": "Format",   "value": int(format_score)},
            {"name": "Skills",   "value": int(skills_score)},
            {"name": "Impact",   "value": int(impact_score)},
            {"name": "Length",   "value": int(length_score)},
        ],
        "strengths":      _generate_strengths(
            resume, keywords, kw_score, skills_score, impact_score, format_score, top_jobs
        ),
        "improvements":   _generate_improvements(
            resume, kw_score, skills_score, impact_score, format_score, length_score, top_jobs
        ),
        "skill_gaps":     _detect_skill_gaps(resume, top_jobs),
        "grammar_issues": _check_grammar(resume),
    }