from app.services.resume_parser import extract_text
from app.services.skill_extractor import extract_skills

text = extract_text(
    "381caf05-a261-465e-b136-0c3f885afbd6/39050feb-9db1-42a7-921a-e655a609447b.pdf"
)

skills = extract_skills(text)

print(skills)