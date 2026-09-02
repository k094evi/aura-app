from app.services.certificate_extractor import extract_certifications
from app.services.certification_engine import recommend_certifications

text = "Experienced network technician, CCNA certified, familiar with routing and switching."
found = extract_certifications(text)
print(found)  # should include 'ccna'

result = recommend_certifications("network engineer", found)
print(result)  # 'ccna' should now appear under matched_certifications, not missing_required