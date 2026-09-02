# app/utils/phrase_matching.py

import spacy
from spacy.matcher import PhraseMatcher


# Create a lightweight English NLP pipeline used only for matching phrases.
_nlp = spacy.blank("en")


def build_matcher(phrases: list[str], label: str) -> PhraseMatcher:
    # Create a matcher that compares phrases without considering capitalization.
    matcher = PhraseMatcher(_nlp.vocab, attr="LOWER")

    # Convert each skill phrase into a spaCy document for matching.
    matcher.add(label, [_nlp.make_doc(phrase) for phrase in phrases])

    # Return the configured matcher for later use.
    return matcher


def find_matches(text: str, matcher: PhraseMatcher) -> set[str]:
    # Convert the resume text into a spaCy document.
    doc = _nlp(text)

    # Find all phrases from the configured matcher.
    matches = matcher(doc)

    # Return matched phrases in lowercase without duplicates.
    return {
        doc[start:end].text.lower()
        for _, start, end in matches
    }