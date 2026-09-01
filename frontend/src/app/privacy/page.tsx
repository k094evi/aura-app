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
// depends on the "from" query param and must be evaluated per request
export const dynamic = 'force-dynamic';

type Section = {
  icon: LucideIcon;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  title: string;
  description: string;
  content: { subtitle: string; text: string }[];
};

const SECTIONS: Section[] = [
  {
    icon: FileText,
    iconBg: 'bg-violet-500/10',
    iconBorder: 'border-violet-500/20',
    iconColor: 'text-violet-400',
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
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
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
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
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
    iconBg: 'bg-violet-500/10',
    iconBorder: 'border-violet-500/20',
    iconColor: 'text-violet-400',
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
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
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
    iconBg: 'bg-violet-500/10',
    iconBorder: 'border-violet-500/20',
    iconColor: 'text-violet-400',
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
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
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
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
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
    iconBg: 'bg-violet-500/10',
    iconBorder: 'border-violet-500/20',
    iconColor: 'text-violet-400',
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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0c0a14] pt-20">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />

      {/* Sub-header / back link */}
      <div className="relative z-10 flex w-full shrink-0 items-center justify-between px-8 pb-8 pt-5 md:px-16">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm font-semibold text-fuchsia-500 transition-colors hover:text-fuchsia-400"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </div>

      <div className="relative z-10 flex w-full flex-col px-8 pb-16 md:px-16">
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold leading-normal text-white [text-shadow:none]">Privacy Policy</h1>
          <p className="mt-1 text-sm text-white/40">Last Updated: June 17, 2025</p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-white/60">
            This Privacy Policy explains how Aura collects, uses, and
            protects the personal information of users in the Philippines in accordance
            with the{' '}
            <span className="font-semibold text-white/80">
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
              className="mb-6 w-full rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-7 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
              <div className="mb-5 flex items-center gap-3.5">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${section.iconBg} ${section.iconBorder}`}
                >
                  <Icon className={`size-5 ${section.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                  <p className="text-[13px] text-white/50">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && (
                      <h3 className="mb-1 text-sm font-bold text-white">{item.subtitle}</h3>
                    )}
                    <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
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