# FILE LOCATION: app/data/it_domain.py
"""
PURPOSE
-------
Single place that defines what "IT field" means for Aura.

Aura is scoped to Information Technology roles only. Everything that
needs to decide "is this IT?" imports from here so the rule lives in
ONE file:

  - job_matcher.py        -> drops non-IT target titles and non-IT job listings
  - target_job_matcher.py -> only resolves / offers IT target jobs
  - job_scorer.py         -> (via job_matcher) only ever sees IT jobs

The frontend keeps a mirror of IT_JOB_TITLES / IT_COMPANIES in
src/features/dashboard/data/itCatalog.ts — keep the two lists in sync.
"""

import re
from typing import Iterable

# Canonical titles offered in the frontend dropdown.
IT_JOB_TITLES: list[str] = ['AI Engineer', 'Automation Test Engineer', 'Backend Developer', 'Blockchain Developer', 'Business Intelligence Analyst', 'Cloud Engineer', 'Cloud Security Engineer', 'Cybersecurity Analyst', 'Data Analyst', 'Data Engineer', 'Data Scientist', 'Database Administrator', 'DevOps Engineer', 'Embedded Systems Engineer', 'ERP Consultant', 'Frontend Developer', 'Full Stack Developer', 'Game Developer', 'Help Desk Technician', 'IT Auditor', 'IT Business Analyst', 'IT Project Manager', 'IT Support Specialist', 'Machine Learning Engineer', 'Mobile Developer', 'Network Administrator', 'Network Engineer', 'Penetration Tester', 'QA Engineer', 'Salesforce Developer', 'Scrum Master', 'Security Engineer', 'Site Reliability Engineer', 'Software Architect', 'Software Engineer', 'Software Tester', 'Solutions Architect', 'Systems Administrator', 'Systems Analyst', 'Technical Support Engineer', 'UI/UX Designer', 'Web Developer']

# Companies offered in the frontend dropdown (IT / tech employers).
IT_COMPANIES: list[str] = ['Accenture', 'Adobe', 'Amazon', 'Apple', 'Atlassian', 'Capgemini', 'Cisco', 'Cloudflare', 'Cognizant', 'CrowdStrike', 'Databricks', 'Dell Technologies', 'Dropbox', 'DXC Technology', 'Figma', 'Fortinet', 'Fujitsu', 'GCash', 'GitHub', 'GitLab', 'Globe Telecom', 'Google', 'Grab', 'HP', 'HubSpot', 'IBM', 'Infosys', 'Intel', 'Lazada', 'LinkedIn', 'Maya', 'Meta', 'Microsoft', 'MongoDB', 'Netflix', 'Notion', 'NTT Data', 'Nvidia', 'Okta', 'Oracle', 'Palo Alto Networks', 'PayMongo', 'PayPal', 'PLDT', 'Red Hat', 'Salesforce', 'Samsung', 'SAP', 'ServiceNow', 'Shopee', 'Shopify', 'Slack', 'Snowflake', 'Splunk', 'Sprout Solutions', 'Stripe', 'Thinking Machines', 'Trend Micro', 'Twilio', 'Uber', 'VMware', 'Wipro', 'Workday', 'Xendit', 'Zendesk', 'Zoom']

_IT_TITLE_SET = {t.lower() for t in IT_JOB_TITLES}

# A title is IT if it contains any of these terms as whole words / phrases.
_IT_TITLE_PATTERN = re.compile(
    r"(?<![a-z0-9])("
    r"software|developer|programmer|devops|sre|full[\s-]?stack|front[\s-]?end|back[\s-]?end|"
    r"web|mobile|android|ios|cloud|data\s+(?:scientist|analyst|engineer|architect)|"
    r"machine\s+learning|ml|ai|artificial\s+intelligence|cyber\s?security|security\s+"
    r"(?:analyst|engineer|architect)|penetration|network|systems?\s+(?:admin\w*|analyst|engineer)|"
    r"sysadmin|database|dba|qa|quality\s+assurance|tester|test\s+automation|it|"
    r"help\s?desk|technical\s+support|tech\s+support|ui|ux|scrum|solutions?\s+architect|"
    r"blockchain|embedded|firmware|erp|salesforce|information\s+technology|"
    r"business\s+intelligence|game\s+developer|site\s+reliability"
    r")(?![a-z0-9])",
    re.IGNORECASE,
)

# Titles that contain an IT-looking word but are not IT roles.
_NON_IT_TITLE_PATTERN = re.compile(
    r"real\s+estate|property|business\s+development|sales|nurse|nursing|civil|mechanical|"
    r"electrical|chemical|construction|medical|pharmac|teacher|driver|cashier|"
    r"call\s+cent(?:er|re)|customer\s+service",
    re.IGNORECASE,
)

# Single-token tech vocabulary used when a listing's TITLE is ambiguous:
# if its description mentions enough of these, it is an IT job anyway.
_IT_DESCRIPTION_TERMS = {
    "python", "java", "javascript", "typescript", "sql", "nosql", "aws", "azure", "gcp",
    "docker", "kubernetes", "api", "apis", "react", "angular", "vue", "node.js", "linux",
    "git", "github", "software", "devops", "cloud", "database", "cybersecurity", "network",
    "networking", "firewall", "backend", "frontend", "fullstack", "microservices", "agile",
    "scrum", "ci/cd", "terraform", "html", "css", "c#", "c++", "php", "golang", "kotlin",
    "swift", "android", "ios", "machine", "algorithms", "debugging", "programming",
    "coding", "developer", "infrastructure", "servers", "helpdesk", "troubleshooting",
}
_MIN_DESCRIPTION_HITS = 3


def is_it_title(title: str) -> bool:
    """True if a job TITLE (typed by the user or listed by an employer) is an IT role."""
    t = (title or "").strip().lower()
    if not t:
        return False
    if t in _IT_TITLE_SET:
        return True
    if _NON_IT_TITLE_PATTERN.search(t):
        return False
    return bool(_IT_TITLE_PATTERN.search(t))


def looks_like_it_job(title: str, description: str = "") -> bool:
    """
    True if a job LISTING is an IT job: its title is IT, or (for ambiguous
    titles such as "Analyst" / "Consultant") its description is clearly technical.
    """
    if is_it_title(title):
        return True
    if _NON_IT_TITLE_PATTERN.search((title or "").lower()):
        return False
    tokens = set(re.findall(r"[a-z][a-z0-9+#./]*", (description or "").lower()))
    return len(tokens & _IT_DESCRIPTION_TERMS) >= _MIN_DESCRIPTION_HITS


def canonical_it_title(title: str) -> str:
    """Canonical spelling if `title` is exactly one of IT_JOB_TITLES (case-insensitive), else ''."""
    t = (title or "").strip().lower()
    return next((c for c in IT_JOB_TITLES if c.lower() == t), "")


def filter_it_titles(titles: Iterable[str]) -> list[str]:
    return [t for t in titles if is_it_title(t)]