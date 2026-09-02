# tests/test_skill_gap_demo.py
from app.services.skill_extractor import extract_skills
from app.services.skill_gap import calculate_skill_gap

sample_resume_text = """
Experienced network technician with hands-on skills in Cisco routing,
VLAN configuration, and TCP/IP fundamentals. Familiar with OSPF and
basic firewall setup.
"""

print("STEP 1: Extracting skills...")
skills = extract_skills(sample_resume_text)
print(f"Found skills: {skills}\n")

print("STEP 2: Calculating skill gap for 'network engineer'...")
gap = calculate_skill_gap("network engineer", skills)
print(f"Matched: {gap['matched_skills']}")
print(f"Missing (required): {gap['missing_required_skills']}")
print(f"Missing (optional): {gap['missing_optional_skills']}")