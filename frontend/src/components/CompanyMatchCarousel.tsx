'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
} from 'lucide-react';

export interface CompanyMatch {
  company: string;
  match: number;
  reason: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
  teamSize: string;
  requirements: string[];
  top_job_url?: string;
}

interface CompanyMatchCarouselProps {
  companies: CompanyMatch[];
}

// Shared dark select style, matching the settings/profile inputs
const DARK_SELECT_CLASSES =
  'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20';

export default function CompanyMatchCarousel({
  companies,
}: CompanyMatchCarouselProps) {
  // Filter state for location, job type, and experience level
  const [locationFilter, setLocationFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [experienceLevelFilter, setExperienceLevelFilter] =
    useState('All');

  // Index of the company currently shown in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Apply all active filters to the company list
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (
        locationFilter !== 'All' &&
        !company.location.includes(locationFilter)
      )
        return false;

      if (
        jobTypeFilter !== 'All' &&
        company.jobType !== jobTypeFilter
      )
        return false;

      if (
        experienceLevelFilter !== 'All' &&
        !company.experienceLevel.includes(
          experienceLevelFilter
        )
      )
        return false;

      return true;
    });
  }, [
    companies,
    locationFilter,
    jobTypeFilter,
    experienceLevelFilter,
  ]);

  // The company currently displayed, clamped to valid range
  const activeCompany =
    filteredCompanies.length > 0
      ? filteredCompanies[
          Math.min(
            currentIndex,
            filteredCompanies.length - 1
          )
        ]
      : null;

  // Advance to the next company, wrapping around to the start
  const nextCompany = () => {
    setCurrentIndex((prev) =>
      prev === filteredCompanies.length - 1
        ? 0
        : prev + 1
    );
  };

  // Go to the previous company, wrapping around to the end
  const previousCompany = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? filteredCompanies.length - 1
        : prev - 1
    );
  };

  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
          <Building2 className="size-5 text-emerald-400" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            Top Company Matches
          </h2>

          <p className="text-[13px] text-white/50">
            Companies where your resume has the strongest fit
          </p>
        </div>
      </div>

      {/* Filter controls for location, job type, and experience */}
      <div className="mb-6 flex flex-wrap gap-3 border-b border-white/[0.07] pb-6">
        <div className="min-w-50 flex-1">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
            Location
          </label>

          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            className={DARK_SELECT_CLASSES}
          >
            <option className="bg-[#1a1726]" value="All">All Locations</option>
            <option className="bg-[#1a1726]" value="CA">California</option>
            <option className="bg-[#1a1726]" value="WA">Washington</option>
            <option className="bg-[#1a1726]" value="NY">New York</option>
          </select>
        </div>

        <div className="min-w-50 flex-1">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
            Job Type
          </label>

          <select
            value={jobTypeFilter}
            onChange={(e) =>
              setJobTypeFilter(e.target.value)
            }
            className={DARK_SELECT_CLASSES}
          >
            <option className="bg-[#1a1726]" value="All">All Types</option>
            <option className="bg-[#1a1726]" value="Full-time">Full-time</option>
            <option className="bg-[#1a1726]" value="Part-time">Part-time</option>
            <option className="bg-[#1a1726]" value="Contract">Contract</option>
          </select>
        </div>

        <div className="min-w-50 flex-1">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">
            Experience
          </label>

          <select
            value={experienceLevelFilter}
            onChange={(e) =>
              setExperienceLevelFilter(e.target.value)
            }
            className={DARK_SELECT_CLASSES}
          >
            <option className="bg-[#1a1726]" value="All">All Levels</option>
            <option className="bg-[#1a1726]" value="Mid">Mid-Level</option>
            <option className="bg-[#1a1726]" value="Senior">Senior</option>
            <option className="bg-[#1a1726]" value="Lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Show empty state if no companies match the filters */}
      {filteredCompanies.length === 0 || !activeCompany ? (
        <div className="py-12 text-center">
          <p className="text-sm text-white/40">
            No companies match your filters
          </p>
        </div>
      ) : (
        <>
          {/* Carousel navigation controls */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={previousCompany}
              className="flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="text-center">
              <p className="text-sm text-white/50">
                Company {currentIndex + 1} of{' '}
                {filteredCompanies.length}
              </p>
            </div>

            <button
              onClick={nextCompany}
              className="flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Card showing details for the active company */}
          <motion.div
            key={activeCompany.company}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/[0.08] to-white/[0.02] p-6"
          >
            {/* Company name, match reason, and match score */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-extrabold text-white">
                  {activeCompany.company}
                </h3>

                <p className="text-sm text-white/60">
                  {activeCompany.reason}
                </p>
              </div>

              <div className="text-right">
                <div className="mb-1 text-4xl font-black text-fuchsia-400">
                  {activeCompany.match}%
                </div>

                <span className="rounded-md bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-fuchsia-300">
                  Match Score
                </span>
              </div>
            </div>

            {/* Visual bar representing the match percentage */}
            <div className="mb-6">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${activeCompany.match}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"
                />
              </div>
            </div>

            {/* Job details: location, type, experience, salary, team size */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="size-4 text-fuchsia-400" />
                {activeCompany.location}
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <Briefcase className="size-4 text-fuchsia-400" />
                {activeCompany.jobType}
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <Clock className="size-4 text-fuchsia-400" />
                {activeCompany.experienceLevel}
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <DollarSign className="size-4 text-fuchsia-400" />
                {activeCompany.salary}
              </div>

              <div className="col-span-2 flex items-center gap-2 text-sm text-white/70">
                <Users className="size-4 text-fuchsia-400" />
                Team: {activeCompany.teamSize}
              </div>
            </div>

            {/* List of job requirements for this company */}
            <div>
              <h4 className="mb-3 text-xs font-black uppercase text-white/40">
                Job Requirements
              </h4>

              <div className="space-y-2">
                {activeCompany.requirements.map(
                  (requirement, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm text-white/70"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <span>{requirement}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Preserved from src1: link is only clickable when a real job URL exists */}
            {activeCompany.top_job_url ? (
              <a
                href={activeCompany.top_job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-3 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90"
              >
                View Full Job Posting
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-white/[0.05] px-6 py-3 text-sm font-bold text-white/30"
              >
                No Job Posting Available
              </button>
            )}
          </motion.div>
        </>
      )}

      {/* Summary count of filtered vs total companies */}
      <div className="mt-4 text-center text-xs text-white/30">
        Showing {filteredCompanies.length} of {companies.length}{' '}
        companies
      </div>
    </div>
  );
}