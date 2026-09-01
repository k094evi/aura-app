'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock, Send, Check } from 'lucide-react';

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
      // Wire this up to a real endpoint, e.g.:
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, subject, message }) });
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Contact Us</h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-2xl">
            Have a question, found a bug, or just want to share feedback? Send us a message and
            we'll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact info sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">Email</h2>
              <p className="text-sm text-gray-500">email</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">Response Time</h2>
              <p className="text-sm text-gray-500">We typically reply within 2–3 business days.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">General Feedback</h2>
              <p className="text-sm text-gray-500">
                Bug reports, feature requests, and general feedback are all welcome.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Message sent</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Thanks for reaching out — we'll get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Tell us what's going on..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}