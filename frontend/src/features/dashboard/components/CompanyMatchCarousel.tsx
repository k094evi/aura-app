// src/components/CompanyMatchCarousel.tsx

'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

import {
  Building2,
  ChevronDown,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  type LucideIcon,
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

// Labelled dropdown from the Figma filter row (native <select> with a custom chevron)
function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-[6px] sm:w-[180px] sm:flex-none">
      <label htmlFor={id} className="text-[11px] font-bold uppercase text-[#9ca3af]">
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate rounded-[10px] border-[1.5px] border-white bg-white/[0.72] py-2 pl-[14px] pr-9 text-[13px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-[14px] top-1/2 size-[14px] -translate-y-1/2 text-[#4b5563]" />
      </div>
    </div>
  );
}

// One "icon + text" pill in the company details row
function DetailPill({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border-[1.5px] border-white bg-white/[0.72] px-3 py-2">
      <Icon className="size-4 shrink-0 text-[#8b5cf6]" />
      <span className="text-[13px] font-medium text-[#4b5563]">{text}</span>
    </div>
  );
}

export default function CompanyMatchCarousel({ companies }: CompanyMatchCarouselProps) {
  // Filter state for location, job type, and experience level
  const [locationFilter, setLocationFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('All');

  // Index of the company currently shown in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Apply all active filters to the company list
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (locationFilter !== 'All' && !company.location.includes(locationFilter)) return false;

      if (jobTypeFilter !== 'All' && company.jobType !== jobTypeFilter) return false;

      if (
        experienceLevelFilter !== 'All' &&
        !company.experienceLevel.includes(experienceLevelFilter)
      )
        return false;

      return true;
    });
  }, [companies, locationFilter, jobTypeFilter, experienceLevelFilter]);

  // The index and company currently displayed, clamped to the valid range
  const activeIndex =
    filteredCompanies.length > 0 ? Math.min(currentIndex, filteredCompanies.length - 1) : 0;
  const activeCompany = filteredCompanies.length > 0 ? filteredCompanies[activeIndex] : null;

  // Changing a filter always starts again from the first matching company
  const applyFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentIndex(0);
  };

  // Advance to the next company, wrapping around to the start
  const nextCompany = () => {
    const last = filteredCompanies.length - 1;
    setCurrentIndex((prev) => {
      const index = Math.min(prev, last);
      return index === last ? 0 : index + 1;
    });
  };

  // Go to the previous company, wrapping around to the end
  const previousCompany = () => {
    const last = filteredCompanies.length - 1;
    setCurrentIndex((prev) => {
      const index = Math.min(prev, last);
      return index === 0 ? last : index - 1;
    });
  };

  const matchPercent = activeCompany ? Math.min(100, Math.max(0, activeCompany.match)) : 0;

  return (
    <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-[14px]">
        <div className="flex shrink-0 items-center justify-center rounded-[12px] border border-[#10b981]/20 bg-[#10b981]/10 p-[10px]">
          <Building2 className="size-5 text-[#10b981]" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-[18px] font-bold leading-tight text-[#111827]">Top Company Matches</h2>
          <p className="text-[13px] text-[#4b5563]">
            Companies where your resume has the strongest fit
          </p>
        </div>
      </div>

      {/* Filter controls for location, job type, and experience */}
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          id="company-filter-location"
          label="Location"
          value={locationFilter}
          onChange={applyFilter(setLocationFilter)}
        >
          <option value="All">All Locations</option>
          <option value="CA">California</option>
          <option value="WA">Washington</option>
          <option value="NY">New York</option>
        </FilterSelect>

        <FilterSelect
          id="company-filter-job-type"
          label="Job Type"
          value={jobTypeFilter}
          onChange={applyFilter(setJobTypeFilter)}
        >
          <option value="All">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </FilterSelect>

        <FilterSelect
          id="company-filter-experience"
          label="Experience"
          value={experienceLevelFilter}
          onChange={applyFilter(setExperienceLevelFilter)}
        >
          <option value="All">All Experience</option>
          <option value="Mid">Mid-Level</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </FilterSelect>
      </div>

      {/* Show empty state if no companies match the filters */}
      {filteredCompanies.length === 0 || !activeCompany ? (
        <div className="py-12 text-center">
          <p className="text-[13px] text-[#4b5563]">No companies match your filters</p>
        </div>
      ) : (
        <>
          {/* Card showing details for the active company */}
          <motion.div
            key={activeCompany.company}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5 rounded-[16px] border-[1.5px] border-[#8b5cf6]/20 bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]"
          >
            {/* Company name, match reason, and match score */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <h3 className="truncate text-[28px] font-black leading-tight text-[#111827]">
                  {activeCompany.company}
                </h3>
                <p className="text-[13px] text-[#4b5563]">{activeCompany.reason}</p>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-3 py-2">
                <span className="text-[24px] font-extrabold leading-none text-[#8b5cf6]">
                  {activeCompany.match}%
                </span>
                <span className="text-[10px] font-bold uppercase text-[#9ca3af]">Match Score</span>
              </div>
            </div>

            {/* Visual bar representing the match percentage */}
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#7c3aed]/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_100%)]"
              />
            </div>

            {/* Job details: location, type, experience, salary, team size */}
            <div className="flex flex-wrap gap-3">
              <DetailPill icon={MapPin} text={activeCompany.location} />
              <DetailPill icon={Clock} text={activeCompany.jobType} />
              <DetailPill icon={Briefcase} text={activeCompany.experienceLevel} />
              <DetailPill icon={DollarSign} text={activeCompany.salary} />
              <DetailPill icon={Users} text={`Team: ${activeCompany.teamSize}`} />
            </div>

            {/* List of job requirements for this company */}
            <div className="flex flex-col gap-[10px] pt-2">
              <h4 className="text-[11px] font-bold uppercase text-[#9ca3af]">Key Qualifications</h4>

              {activeCompany.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-[#10b981]" />
                  <span className="min-w-0 flex-1 text-[13px] text-[#4b5563]">{requirement}</span>
                </div>
              ))}
            </div>

            {/* Preserved from src1: link is only clickable when a real job URL exists */}
            {activeCompany.top_job_url ? (
              <a
                href={activeCompany.top_job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)] px-8 py-3 text-[14px] font-bold text-white shadow-[0_8px_12px_rgba(124,58,237,0.2)] transition hover:brightness-105 active:brightness-95"
              >
                View Full Job Posting
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-full bg-[#7c3aed]/[0.06] px-8 py-3 text-[14px] font-bold text-[#9ca3af]"
              >
                No Job Posting Available
              </button>
            )}
          </motion.div>

          {/* Carousel navigation (wraps around at both ends) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <p className="text-[14px] font-medium text-[#6b737d]">
              Company {activeIndex + 1} of {filteredCompanies.length}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={previousCompany}
                className="rounded-[10px] border-[1.5px] border-[#e3e5eb] bg-white/[0.72] px-4 py-[10px] text-[14px] font-medium text-[#6b737d] transition hover:bg-white"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={nextCompany}
                className="rounded-[10px] bg-[#8b5cf6] px-4 py-[10px] text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)] transition hover:bg-[#7c3aed]"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Summary count, shown only while filters are hiding some companies */}
      {filteredCompanies.length !== companies.length && (
        <p className="text-center text-[12px] text-[#9ca3af]">
          Showing {filteredCompanies.length} of {companies.length} companies
        </p>
      )}
    </section>
  );
}