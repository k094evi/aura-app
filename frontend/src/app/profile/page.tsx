'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Briefcase,
  MapPin,
  Files,
  Award,
  Calendar,
  Check,
  UserCircle,
} from 'lucide-react';

export default function MyProfilePage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [location, setLocation] = useState('Metro Manila');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
      {/* Back link — py-2.5 added to match History's tap target sizing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 py-2.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your personal information and account details.</p>
        </div>

        {/* Avatar + quick stats */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/* Positioning, sizing, and spacing here are all forced via inline
                style rather than Tailwind utilities (flex/gap/relative/absolute
                were only partially applying on this page, causing the badge
                to overlap the text column) */}
            <div style={{ position: 'relative', width: 64, height: 64, flex: '0 0 auto' }}>
              <div
                className="rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-extrabold"
                style={{ width: 64, height: 64 }}
              >
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <button
                className="rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                style={{ position: 'absolute', bottom: -6, right: -6, width: 26, height: 26 }}
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* text scale matched to History's filename/date pattern:
                text-sm font-bold for the primary line, text-xs text-gray-400
                mt-0.5 for the line below it */}
            <div style={{ marginLeft: 20, minWidth: 0, flex: '1 1 auto' }}>
              <p className="text-base font-bold text-gray-900">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{email}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                Member since June 2025
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats — labels get mb-1, values bumped to text-3xl to match
            the summary-metric styling used at the top of the History page.
            Icons matched to History's Total Analyses (Files) and Best ATS
            Score (Award) cards, both using the same indigo icon-box style
            for consistency across the two duplicated metrics. */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <Files className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Analyses</p>
              <p className="text-3xl font-extrabold text-gray-900">3</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Best ATS Score</p>
              <p className="text-3xl font-extrabold text-gray-900">
                82<span className="text-base font-semibold text-gray-400">/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* Editable form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          {/* Section header — icon box + title/subtitle pattern, matching
              the "ATS Score Trend" header on the History page */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-400">Update your name, email, and role details</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}