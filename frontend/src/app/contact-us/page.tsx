'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock, Send, Check, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setError("Couldn't send your message. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0a14] px-4 pb-20 pt-24 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_42%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/60 backdrop-blur-xl transition hover:border-purple-400/30 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            We're here to help
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Let&apos;s <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">talk.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Have a question, found a bug, or want to share feedback? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-purple-950/10 backdrop-blur-xl">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Mail className="h-5 w-5 text-purple-300" />
              </div>
              <h2 className="mb-1 text-sm font-bold text-white">Email</h2>
              <p className="text-sm text-white/45">email</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-purple-950/10 backdrop-blur-xl">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-300" />
              </div>
              <h2 className="mb-1 text-sm font-bold text-white">Response Time</h2>
              <p className="text-sm leading-6 text-white/45">We typically reply within 2–3 business days.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-purple-950/10 backdrop-blur-xl">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                <MessageSquare className="h-5 w-5 text-cyan-300" />
              </div>
              <h2 className="mb-1 text-sm font-bold text-white">General Feedback</h2>
              <p className="text-sm leading-6 text-white/45">Bug reports, feature requests, and general feedback are all welcome.</p>
            </div>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-purple-950/10 backdrop-blur-xl md:p-8">
            {sent ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
                  <Check className="h-7 w-7 text-emerald-300" />
                </div>
                <h2 className="text-xl font-black text-white">Message sent</h2>
                <p className="mb-7 mt-2 max-w-md text-sm leading-6 text-white/45">
                  Thanks for reaching out — we&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-500 hover:to-fuchsia-400"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-xl font-black text-white">Send us a message</h2>
                  <p className="mt-1 text-sm text-white/40">Tell us how we can help.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Name" htmlFor="contact-name">
                    <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" className={inputClass} />
                  </Field>
                  <Field label="Email" htmlFor="contact-email">
                    <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputClass} />
                  </Field>
                </div>

                <Field label="Subject" htmlFor="contact-subject">
                  <input id="contact-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" className={inputClass} />
                </Field>

                <Field label="Message" htmlFor="contact-message">
                  <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Tell us what's going on..." className={`${inputClass} resize-none`} />
                </Field>

                {error && <p role="alert" className="text-xs font-semibold text-red-400">{error}</p>}

                <div className="flex justify-end pt-1">
                  <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-500 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-40">
                    <Send className="h-4 w-4" />
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/25 transition focus:border-purple-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-purple-500/10';

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
        {label}
      </label>
      {children}
    </div>
  );
}
