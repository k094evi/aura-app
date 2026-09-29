// src/features/dashboard/data/itCatalog.ts
// The IT-only options for the Upload form. Mirrors app/data/it_domain.py on
// the backend — keep both lists in sync.

export const IT_JOB_TITLES: string[] = ["AI Engineer", "Automation Test Engineer", "Backend Developer", "Blockchain Developer", "Business Intelligence Analyst", "Cloud Engineer", "Cloud Security Engineer", "Cybersecurity Analyst", "Data Analyst", "Data Engineer", "Data Scientist", "Database Administrator", "DevOps Engineer", "Embedded Systems Engineer", "ERP Consultant", "Frontend Developer", "Full Stack Developer", "Game Developer", "Help Desk Technician", "IT Auditor", "IT Business Analyst", "IT Project Manager", "IT Support Specialist", "Machine Learning Engineer", "Mobile Developer", "Network Administrator", "Network Engineer", "Penetration Tester", "QA Engineer", "Salesforce Developer", "Scrum Master", "Security Engineer", "Site Reliability Engineer", "Software Architect", "Software Engineer", "Software Tester", "Solutions Architect", "Systems Administrator", "Systems Analyst", "Technical Support Engineer", "UI/UX Designer", "Web Developer"];

export const IT_COMPANIES: string[] = ["Accenture", "Adobe", "Amazon", "Apple", "Atlassian", "Capgemini", "Cisco", "Cloudflare", "Cognizant", "CrowdStrike", "Databricks", "Dell Technologies", "Dropbox", "DXC Technology", "Figma", "Fortinet", "Fujitsu", "GCash", "GitHub", "GitLab", "Globe Telecom", "Google", "Grab", "HP", "HubSpot", "IBM", "Infosys", "Intel", "Lazada", "LinkedIn", "Maya", "Meta", "Microsoft", "MongoDB", "Netflix", "Notion", "NTT Data", "Nvidia", "Okta", "Oracle", "Palo Alto Networks", "PayMongo", "PayPal", "PLDT", "Red Hat", "Salesforce", "Samsung", "SAP", "ServiceNow", "Shopee", "Shopify", "Slack", "Snowflake", "Splunk", "Sprout Solutions", "Stripe", "Thinking Machines", "Trend Micro", "Twilio", "Uber", "VMware", "Wipro", "Workday", "Xendit", "Zendesk", "Zoom"];

const norm = (value: string) => value.trim().toLowerCase();

// Mirrors is_it_title() in app/data/it_domain.py — keep the two in sync.
// A typed title counts as IT if it contains an IT term and no non-IT term.
const IT_TITLE_RE =
  /(?<![a-z0-9])(software|developer|programmer|devops|sre|full[\s-]?stack|front[\s-]?end|back[\s-]?end|web|mobile|android|ios|cloud|data\s+(?:scientist|analyst|engineer|architect)|machine\s+learning|ml|ai|artificial\s+intelligence|cyber\s?security|security\s+(?:analyst|engineer|architect)|penetration|network|systems?\s+(?:admin\w*|analyst|engineer)|sysadmin|database|dba|qa|quality\s+assurance|tester|test\s+automation|it|help\s?desk|technical\s+support|tech\s+support|ui|ux|scrum|solutions?\s+architect|blockchain|embedded|firmware|erp|salesforce|information\s+technology|business\s+intelligence|game\s+developer|site\s+reliability)(?![a-z0-9])/i;

const NON_IT_TITLE_RE =
  /real\s+estate|property|business\s+development|sales|nurse|nursing|civil|mechanical|electrical|chemical|construction|medical|pharmac|teacher|driver|cashier|call\s+cent(?:er|re)|customer\s+service/i;

// Returns the canonical spelling of a listed IT title, or '' if it isn't one.
export const canonicalItJobTitle = (value: string): string =>
  IT_JOB_TITLES.find((title) => norm(title) === norm(value)) ?? '';

// True for a listed IT title OR any typed title that reads as an IT role
// (e.g. "Senior React Developer"). Non-IT titles ("Nurse") are rejected.
export const isItJobTitle = (value: string): boolean => {
  const t = norm(value);
  if (!t) return false;
  if (canonicalItJobTitle(t)) return true;
  if (NON_IT_TITLE_RE.test(t)) return false;
  return IT_TITLE_RE.test(t);
};

// What to send to the API: canonical spelling for listed titles, the typed
// text (whitespace collapsed) for other valid IT titles, '' if not IT.
export const normalizeItJobTitle = (value: string): string => {
  const canonical = canonicalItJobTitle(value);
  if (canonical) return canonical;
  return isItJobTitle(value) ? value.trim().replace(/\s+/g, ' ') : '';
};