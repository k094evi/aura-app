import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  ShieldCheck,
  Share2,
  UserCheck,
  Cookie,
  Baby,
  RefreshCw,
  Mail,
  type LucideIcon,
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy – Aura',
  description: 'How Aura collects, uses, and protects your personal information.',
};

// Prevents this route from being statically cached, since the back link
// depends on the "from" query param and must be evaluated per request.
export const dynamic = 'force-dynamic';

type Section = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  content: { subtitle: string; text: string }[];
};

const SECTIONS: Section[] = [
  {
    icon: FileText,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    title: 'Information We Collect',
    description: 'What we ask for when you use Aura',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you register, we collect your email address and a hashed version of your password. We never store your password in plain text.',
      },
      {
        subtitle: 'Resume Content',
        text: 'When you upload a resume, we process its contents — including work history, skills, and contact details — solely to provide analysis and feedback within the app.',
      },
    ],
  },
  {
    icon: Sparkles,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'How We Use Your Information',
    description: 'What your data powers inside the app',
    content: [
      {
        subtitle: 'To Provide the Service',
        text: 'We use your email to identify your account and send transactional messages (e.g. password resets). We use your resume content to generate ATS scores, skill gap analysis, and improvement suggestions.',
      },
      {
        subtitle: 'To Improve the Service',
        text: 'We may use anonymized, aggregated data to improve our analysis algorithms. This data cannot be traced back to any individual user.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Data Storage and Security',
    description: 'How and where your data is kept',
    content: [
      {
        subtitle: 'Storage',
        text: 'Your data is stored on secured servers. We apply industry-standard encryption to data in transit (TLS) and at rest.',
      },
      {
        subtitle: 'Retention',
        text: 'We retain your account data and resume content for as long as your account is active. You may request deletion of your data at any time.',
      },
    ],
  },
  {
    icon: Share2,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    title: 'Sharing of Information',
    description: 'Who we do — and don\u2019t — share data with',
    content: [
      {
        subtitle: 'No Sale of Data',
        text: 'We do not sell, rent, or trade your personal information to any third party.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We may share data with trusted third-party service providers (e.g. cloud hosting, authentication) strictly to operate the platform. These providers are bound by confidentiality agreements.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required to do so by Philippine law or a valid legal process.',
      },
    ],
  },
  {
    icon: UserCheck,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'Your Rights',
    description: 'What you can do with your own data',
    content: [
      {
        subtitle: 'Access and Correction',
        text: 'You may access and update your account information at any time through your profile settings.',
      },
      {
        subtitle: 'Data Deletion',
        text: 'You may request the permanent deletion of your account and all associated data by contacting us at the email below. We will process your request within 30 days.',
      },
      {
        subtitle: 'Data Portability',
        text: 'Upon request, we can provide you with a copy of the personal data we hold about you in a machine-readable format.',
      },
    ],
  },
  {
    icon: Cookie,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    title: 'Cookies',
    description: 'How we use cookies on Aura',
    content: [
      {
        subtitle: 'Session Cookies',
        text: 'We use session cookies to keep you logged in during your visit. These cookies are deleted when you close your browser.',
      },
      {
        subtitle: 'No Tracking Cookies',
        text: 'We do not use advertising or cross-site tracking cookies.',
      },
    ],
  },
  {
    icon: Baby,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: "Children's Privacy",
    description: 'Our policy on users under 18',
    content: [
      {
        subtitle: '',
        text: 'Aura is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with their data, please contact us and we will delete it promptly.',
      },
    ],
  },
  {
    icon: RefreshCw,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'Changes to This Policy',
    description: 'How we handle updates to this page',
    content: [
      {
        subtitle: '',
        text: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page and, where appropriate, notify you by email.',
      },
    ],
  },
  {
    icon: Mail,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    title: 'Contact Us',
    description: 'Reach us with questions or concerns',
    content: [
      {
        subtitle: '',
        text: 'If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at: email',
      },
    ],
  },
];

// searchParams is a Promise in Next.js 15+ Server Components, so this
// component must be async and await it before reading "from".
export default async function PrivacyPolicyPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const from = params?.from;

  // Where the back link points, based on which page the user came from.
  const backHref =
    from === 'signin' ? '/signin'
    : from === 'signup' ? '/signup'
    : from === 'dashboard' ? '/dashboard'
    : '/upload';

  const backLabel =
    from === 'signin' ? 'Back to Sign In'
    : from === 'signup' ? 'Back to Sign Up'
    : from === 'dashboard' ? 'Back to Dashboard'
    : 'Back to Upload';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 py-2.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-1">Last Updated: June 17, 2025</p>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            This Privacy Policy explains how Aura collects, uses, and
            protects the personal information of users in the Philippines in accordance
            with the{' '}
            <span className="font-semibold text-gray-700">
              Data Privacy Act of 2012 (Republic Act No. 10173)
            </span>
            .
          </p>
        </div>

        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.iconBg}`}>
                  <Icon className={`w-5 h-5 ${section.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && (
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{item.subtitle}</h3>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}