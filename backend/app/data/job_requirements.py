# backend/app/data/job_requirements.py


# ============================================================
# AURA JOB REQUIREMENTS
# ============================================================
# This dictionary serves as the single source of truth for
# the skills and certifications associated with each job role.
#
# Each job contains:
#
#   required_skills
#       Core skills that are expected for the selected role.
#
#   optional_skills
#       Additional skills that can improve a candidate's match.
#
#   required_certifications
#       Certifications considered important for the role.
#
#   optional_certifications
#       Additional certifications that can strengthen a match.
#
# These requirements can be used by:
#   - Resume skill extraction
#   - Skill gap analysis
#   - Job matching
#   - Certification matching
#   - ATS scoring
#
# IMPORTANT:
# Keep skill names lowercase because the resume skill extraction
# system should normalize extracted skills to lowercase as well.
# ============================================================


JOB_REQUIREMENTS = {

    # ========================================================
    # 1. FULLSTACK DEVELOPER
    # ========================================================
    # Fullstack developers work on both frontend and backend
    # application development.
    "fullstack developer": {
        "required_skills": [
            "html",
            "css",
            "javascript",
            "frontend development",
            "backend development",
            "rest api",
            "git",
            "database",
        ],
        "optional_skills": [
            "typescript",
            "react",
            "next.js",
            "node.js",
            "express.js",
            "python",
            "java",
            "c#",
            "sql",
            "postgresql",
            "mongodb",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "graphql",
            "microservices",
            "testing",
        ],
        "required_certifications": [
            "aws certified developer",
        ],
        "optional_certifications": [
            "azure developer associate",
        ],
    },


    # ========================================================
    # 2. BACKEND DEVELOPER
    # ========================================================
    # Backend developers focus on server-side programming,
    # APIs, databases, and application logic.
    "backend developer": {
        "required_skills": [
            "programming",
            "backend development",
            "rest api",
            "api development",
            "database",
            "sql",
            "git",
        ],
        "optional_skills": [
            "python",
            "java",
            "c#",
            "node.js",
            "spring boot",
            "django",
            "flask",
            "express.js",
            "postgresql",
            "mysql",
            "mongodb",
            "docker",
            "kubernetes",
            "graphql",
            "microservices",
            "aws",
            "azure",
        ],
        "required_certifications": [
            "aws certified developer",
        ],
        "optional_certifications": [
            "azure developer associate",
        ],
    },


    # ========================================================
    # 3. FRONTEND DEVELOPER
    # ========================================================
    # Frontend developers create the user-facing portion of
    # web applications.
    "frontend developer": {
        "required_skills": [
            "html",
            "css",
            "javascript",
            "frontend development",
            "responsive design",
            "git",
        ],
        "optional_skills": [
            "typescript",
            "react",
            "next.js",
            "vue.js",
            "angular",
            "tailwind css",
            "bootstrap",
            "redux",
            "accessibility",
            "jest",
            "cypress",
            "playwright",
            "web performance",
        ],
        "required_certifications": [
            "meta frontend developer professional certificate",
        ],
        "optional_certifications": [
            "aws certified developer",
        ],
    },


    # ========================================================
    # 4. MOBILE APP DEVELOPER
    # ========================================================
    # Mobile developers create applications for platforms such
    # as Android and iOS.
    "mobile app developer": {
        "required_skills": [
            "mobile development",
            "mobile ui",
            "api integration",
            "git",
        ],
        "optional_skills": [
            "android",
            "ios",
            "kotlin",
            "java",
            "swift",
            "swiftui",
            "flutter",
            "dart",
            "react native",
            "firebase",
            "rest api",
            "mobile testing",
            "push notifications",
        ],
        "required_certifications": [
            "associate android developer",
        ],
        "optional_certifications": [
            "aws certified developer",
        ],
    },


    # ========================================================
    # 5. QA ENGINEER
    # ========================================================
    # QA Engineers test software, identify defects, and verify
    # that applications meet quality requirements.
    "qa engineer": {
        "required_skills": [
            "software testing",
            "test planning",
            "test cases",
            "bug tracking",
            "quality assurance",
        ],
        "optional_skills": [
            "manual testing",
            "automation testing",
            "selenium",
            "cypress",
            "playwright",
            "pytest",
            "jest",
            "postman",
            "api testing",
            "performance testing",
            "regression testing",
            "jira",
            "sql",
        ],
        "required_certifications": [
            "istqb foundation level",
        ],
        "optional_certifications": [
            "istqb advanced level test analyst",
        ],
    },


    # ========================================================
    # 6. CYBERSECURITY ENGINEER
    # ========================================================
    # Cybersecurity Engineers protect systems, networks, and
    # applications from security threats.
    "cybersecurity engineer": {
        "required_skills": [
            "network security",
            "security monitoring",
            "vulnerability management",
            "incident response",
            "access control",
            "security principles",
        ],
        "optional_skills": [
            "firewall",
            "siem",
            "penetration testing",
            "python",
            "linux",
            "cloud security",
            "iam",
            "endpoint security",
            "threat detection",
            "cryptography",
            "wireshark",
            "malware analysis",
        ],
        "required_certifications": [
            "comptia security+",
        ],
        "optional_certifications": [
            "certified ethical hacker",
            "cissp",
            "cism",
        ],
    },


    # ========================================================
    # 7. CLOUD SECURITY ARCHITECT
    # ========================================================
    # Cloud Security Architects design secure cloud
    # infrastructure and identity/access architectures.
    "cloud security architect": {
        "required_skills": [
            "cloud security",
            "iam",
            "network security",
            "security architecture",
            "risk management",
            "identity and access management",
        ],
        "optional_skills": [
            "aws",
            "azure",
            "google cloud",
            "zero trust",
            "encryption",
            "firewall",
            "siem",
            "kubernetes security",
            "container security",
            "devsecops",
            "terraform",
            "security compliance",
        ],
        "required_certifications": [
            "aws certified security specialty",
            "azure security engineer associate",
        ],
        "optional_certifications": [
            "google professional cloud security engineer",
            "cissp",
        ],
    },


    # ========================================================
    # 8. SOC ANALYST
    # ========================================================
    # SOC Analysts monitor security events, investigate
    # incidents, and identify potential threats.
    "soc analyst": {
        "required_skills": [
            "security monitoring",
            "incident response",
            "threat detection",
            "log analysis",
            "siem",
            "network security",
        ],
        "optional_skills": [
            "splunk",
            "microsoft sentinel",
            "elastic",
            "wireshark",
            "linux",
            "python",
            "threat intelligence",
            "malware analysis",
            "digital forensics",
            "mitre att&ck",
            "endpoint detection and response",
        ],
        "required_certifications": [
            "comptia security+",
        ],
        "optional_certifications": [
            "comptia cysa+",
            "certified soc analyst",
        ],
    },


    # ========================================================
    # 9. CLOUD SOLUTIONS ARCHITECT
    # ========================================================
    # Cloud Solutions Architects design scalable, secure, and
    # highly available cloud systems.
    "cloud solutions architect": {
        "required_skills": [
            "cloud computing",
            "cloud architecture",
            "networking",
            "security",
            "scalability",
            "system architecture",
        ],
        "optional_skills": [
            "aws",
            "azure",
            "google cloud",
            "terraform",
            "kubernetes",
            "docker",
            "microservices",
            "serverless",
            "high availability",
            "disaster recovery",
            "iam",
            "load balancing",
        ],
        "required_certifications": [
            "aws solutions architect",
        ],
        "optional_certifications": [
            "azure solutions architect expert",
            "google professional cloud architect",
        ],
    },


    # ========================================================
    # 10. DEVOPS / PLATFORM ENGINEER
    # ========================================================
    # DevOps and Platform Engineers focus on automation,
    # CI/CD, infrastructure, containers, and cloud platforms.
    "devops / platform engineer": {
        "required_skills": [
            "linux",
            "git",
            "ci/cd",
            "automation",
            "cloud computing",
            "containerization",
        ],
        "optional_skills": [
            "docker",
            "kubernetes",
            "terraform",
            "ansible",
            "jenkins",
            "github actions",
            "gitlab ci",
            "aws",
            "azure",
            "google cloud",
            "python",
            "bash",
            "prometheus",
            "grafana",
            "monitoring",
            "infrastructure as code",
        ],
        "required_certifications": [
            "aws certified devops engineer",
        ],
        "optional_certifications": [
            "azure devops engineer expert",
            "cncf kubernetes certifications",
        ],
    },


    # ========================================================
    # 11.  NETWORK ENGINEER
    # ========================================================
    #  Network Engineers manage networking, routing,
    # switching, security, and networking infrastructure.
    "network engineer": {
        "required_skills": [
            "networking",
            "tcp/ip",
            "routing",
            "switching",
            "subnetting",
            "network security",
            "cloud networking",
        ],
        "optional_skills": [
            "cisco",
            "aws",
            "azure",
            "google cloud",
            "vpc",
            "vlan",
            "vpn",
            "firewall",
            "dns",
            "dhcp",
            "wireshark",
            "ospf",
            "bgp",
            "wireless networking",
            "load balancing",
        ],
        "required_certifications": [
            "ccna",
            "ccnp",
        ],
        "optional_certifications": [
            "comptia network+",
            "aws advanced networking specialty",
        ],
    },


    # ========================================================
    # 12. IT INFRASTRUCTURE AUTOMATION ENGINEER
    # ========================================================
    # This role focuses on automating infrastructure and
    # system administration using scripts and IaC tools.
    "it infrastructure automation engineer": {
        "required_skills": [
            "linux",
            "automation",
            "scripting",
            "infrastructure as code",
            "system administration",
            "networking",
        ],
        "optional_skills": [
            "python",
            "bash",
            "powershell",
            "ansible",
            "terraform",
            "puppet",
            "chef",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "monitoring",
            "ci/cd",
        ],
        "required_certifications": [
            "aws certified sysops administrator",
        ],
        "optional_certifications": [
            "red hat certified engineer",
            "azure administrator associate",
        ],
    },


    # ========================================================
    # 13. DATA ENGINEER
    # ========================================================
    # Data Engineers build pipelines and systems for collecting,
    # transforming, storing, and processing data.
    "data engineer": {
        "required_skills": [
            "python",
            "sql",
            "data pipelines",
            "etl",
            "database",
            "data modeling",
        ],
        "optional_skills": [
            "apache spark",
            "apache airflow",
            "kafka",
            "pandas",
            "databricks",
            "snowflake",
            "aws",
            "azure",
            "google cloud",
            "data warehouse",
            "big data",
            "docker",
            "data lake",
            "stream processing",
        ],
        "required_certifications": [
            "aws certified data engineer",
            "azure data engineer associate",
        ],
        "optional_certifications": [
            "google professional data engineer",
        ],
    },


    # ========================================================
    # 14. DATA ANALYST
    # ========================================================
    # Data Analysts use data analysis, statistics, visualization,
    # and business intelligence tools to produce insights.
    "data analyst": {
        "required_skills": [
            "sql",
            "data analysis",
            "data visualization",
            "statistics",
            "excel",
        ],
        "optional_skills": [
            "python",
            "pandas",
            "power bi",
            "tableau",
            "matplotlib",
            "numpy",
            "r",
            "data cleaning",
            "dashboard development",
            "data storytelling",
            "business intelligence",
        ],
        "required_certifications": [
            "microsoft power bi data analyst",
        ],
        "optional_certifications": [
            "tableau certification",
            "google data analytics certificate",
        ],
    },


    # ========================================================
    # 15. DATABASE ADMINISTRATOR
    # ========================================================
    # Database Administrators manage databases, security,
    # performance, monitoring, backup, and recovery.
    "database administrator": {
        "required_skills": [
            "sql",
            "database administration",
            "database security",
            "backup and recovery",
            "database monitoring",
        ],
        "optional_skills": [
            "postgresql",
            "mysql",
            "oracle",
            "sql server",
            "mongodb",
            "database optimization",
            "performance tuning",
            "replication",
            "high availability",
            "linux",
            "cloud databases",
            "disaster recovery",
        ],
        "required_certifications": [
            "oracle database certification",
        ],
        "optional_certifications": [
            "microsoft azure database administrator",
            "aws database specialty",
        ],
    },


    # ========================================================
    # 16. AI / MACHINE LEARNING ENGINEER
    # ========================================================
    # AI/ML Engineers develop, train, evaluate, and deploy
    # machine learning and artificial intelligence models.
    "ai / machine learning engineer": {
        "required_skills": [
            "python",
            "machine learning",
            "statistics",
            "data preprocessing",
            "model development",
            "model evaluation",
        ],
        "optional_skills": [
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "pandas",
            "numpy",
            "deep learning",
            "natural language processing",
            "computer vision",
            "transformers",
            "hugging face",
            "mlops",
            "docker",
            "aws",
            "azure",
            "generative ai",
            "large language models",
        ],
        "required_certifications": [
            "google professional machine learning engineer",
        ],
        "optional_certifications": [
            "aws machine learning specialty",
            "azure ai engineer associate",
        ],
    },


    # ========================================================
    # 17. AI SOLUTIONS ARCHITECT
    # ========================================================
    # AI Solutions Architects design systems that integrate
    # AI/ML capabilities with cloud and software architectures.
    "ai solutions architect": {
        "required_skills": [
            "artificial intelligence",
            "machine learning",
            "cloud computing",
            "system architecture",
            "api development",
            "data architecture",
        ],
        "optional_skills": [
            "generative ai",
            "large language models",
            "llm",
            "rag",
            "python",
            "aws",
            "azure",
            "google cloud",
            "microservices",
            "docker",
            "kubernetes",
            "mlops",
            "ai governance",
            "model deployment",
        ],
        "required_certifications": [
            "aws machine learning specialty",
        ],
        "optional_certifications": [
            "azure ai engineer associate",
            "google professional machine learning engineer",
        ],
    },


    # ========================================================
    # 18. AI GOVERNANCE & RISK SPECIALIST
    # ========================================================
    # This role focuses on AI governance, risk management,
    # compliance, privacy, responsible AI, and auditing.
    "ai governance & risk specialist": {
        "required_skills": [
            "ai governance",
            "risk management",
            "artificial intelligence",
            "data privacy",
            "compliance",
            "risk assessment",
        ],
        "optional_skills": [
            "responsible ai",
            "ai ethics",
            "model risk management",
            "privacy",
            "security",
            "audit",
            "nist ai risk management framework",
            "iso 27001",
            "iso 42001",
            "gdpr",
            "bias assessment",
            "model governance",
            "ai risk management",
        ],
        "required_certifications": [
            "cissp",
            "cism",
        ],
        "optional_certifications": [
            "iso 27001",
            "iso 42001",
        ],
    },


    # ========================================================
    # 19. UI/UX DESIGNER
    # ========================================================
    # UI/UX Designers focus on user research, interface design,
    # wireframing, prototyping, and usability.
    "ui/ux designer": {
        "required_skills": [
            "ui design",
            "ux design",
            "user research",
            "wireframing",
            "prototyping",
            "usability testing",
        ],
        "optional_skills": [
            "figma",
            "adobe xd",
            "sketch",
            "design systems",
            "interaction design",
            "information architecture",
            "user journey mapping",
            "accessibility",
            "responsive design",
            "html",
            "css",
            "user interface design",
            "user experience research",
        ],
        "required_certifications": [
            "google ux design certificate",
        ],
        "optional_certifications": [
            "nielsen norman group ux certification",
        ],
    },


    # ========================================================
    # 20. IT SUPPORT / SYSTEMS ADMINISTRATOR
    # ========================================================
    # IT Support and Systems Administrators troubleshoot
    # hardware, software, operating systems, networks, and
    # user-related technical problems.
    "it support / systems administrator": {
        "required_skills": [
            "troubleshooting",
            "operating systems",
            "networking",
            "hardware support",
            "user support",
            "system administration",
        ],
        "optional_skills": [
            "windows server",
            "linux",
            "active directory",
            "microsoft 365",
            "azure",
            "aws",
            "powershell",
            "bash",
            "tcp/ip",
            "dns",
            "dhcp",
            "vpn",
            "backup and recovery",
            "ticketing systems",
            "cybersecurity",
            "virtualization",
            "vmware",
        ],
        "required_certifications": [
            "comptia a+",
            "comptia network+",
            "comptia security+",
        ],
        "optional_certifications": [
            "red hat certified system administrator",
        ],
    },
}


# ============================================================
# GET ALL KNOWN SKILLS
# ============================================================
# Creates a single list containing every skill used across
# all 20 supported job roles.
#
# This is intentionally DERIVED from JOB_REQUIREMENTS instead
# of maintaining a separate skills list.
#
# Why?
#   If a skill is added to a job requirement, it automatically
#   becomes available to the skill detection system.
#
# This prevents two separate lists from becoming inconsistent.
# ============================================================
def get_all_known_skills() -> list[str]:

    skills = set()

    # Loop through every supported job.
    for job in JOB_REQUIREMENTS.values():

        # Add the job's required skills.
        skills.update(job["required_skills"])

        # Add the job's optional skills.
        skills.update(job["optional_skills"])

    # Convert the set back to a sorted list so the result is
    # deterministic and easy to use elsewhere in the application.
    return sorted(skills)

# app/data/job_requirements.py — add alongside get_all_known_skills()
def get_all_known_certifications() -> list[str]:
    certs = set()
    for job in JOB_REQUIREMENTS.values():
        certs.update(job["required_certifications"])
        certs.update(job["optional_certifications"])
    return sorted(certs)

