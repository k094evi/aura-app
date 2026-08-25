from app.services.skill_gap import calculate_skill_gap


resume_skills = [
    "cisco",
    "routing",
    "tcp/ip",
    "vlan",
]

result = calculate_skill_gap(
    "network engineer",
    resume_skills
)

print(result)