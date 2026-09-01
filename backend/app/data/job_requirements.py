# FILE LOCATION: app/data/job_requirements.py
"""
Migrated from backend_2 as-is. Static per-role skill/certification
checklist used by app/services/target_job_matcher.py to compute a
role-specific skill gap for a user's target_job.
"""

JOB_REQUIREMENTS = {

    "network engineer": {
        "skills": {
            "required": [
                "cisco",
                "routing",
                "switching",
                "tcp/ip",
                "subnetting",
                "vlan",
                "network troubleshooting",
                "network security",
            ],
            "optional": [
                "firewall",
                "vpn",
                "wireshark",
                "wireless networking",
                "ospf",
                "bgp",
                "ccnp",
            ],
        },
        "certifications": {
            "required": [
                "ccna",
            ],
            "optional": [
                "ccnp",
                "comptia network+",
            ],
        },
    },

    "software engineer": {
        "skills": {
            "required": [
                "python",
                "sql",
                "git",
                "programming",
                "software development",
                "debugging",
            ],
            "optional": [
                "docker",
                "aws",
                "typescript",
                "javascript",
                "java",
                "rest api",
                "linux",
                "ci/cd",
            ],
        },
        "certifications": {
            "required": [],
            "optional": [
                "aws certified developer",
                "azure developer associate",
            ],
        },
    },

    "data analyst": {
        "skills": {
            "required": [
                "python",
                "sql",
                "data analysis",
                "data visualization",
                "statistics",
                "excel",
            ],
            "optional": [
                "power bi",
                "tableau",
                "pandas",
                "numpy",
                "machine learning",
                "r",
                "data cleaning",
                "data modeling",
            ],
        },
        "certifications": {
            "required": [],
            "optional": [
                "microsoft certified power bi data analyst",
                "tableau desktop specialist",
                "google data analytics professional certificate",
            ],
        },
    },
}

def get_all_known_skills() -> list[str]:
    """The flat detection vocabulary is DERIVED from job requirements,
    not maintained separately — one source of truth, nothing to drift out of sync."""
    skills = set()
    for job in JOB_REQUIREMENTS.values():
        skills.update(job["skills"]["required"])
        skills.update(job["skills"]["optional"])
    return sorted(skills)