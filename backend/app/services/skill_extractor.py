# app/services/skill_extractor.py
import spacy
from spacy.matcher import PhraseMatcher
from app.data.job_requirements import get_all_known_skills

_nlp = spacy.blank("en")
_matcher = PhraseMatcher(_nlp.vocab, attr="LOWER")
_matcher.add("SKILLS", [_nlp.make_doc(skill) for skill in get_all_known_skills()])


def extract_skills(text: str) -> list[str]:
    doc = _nlp(text)
    matches = _matcher(doc)
    found = {doc[start:end].text.lower() for _, start, end in matches}
    return sorted(found)