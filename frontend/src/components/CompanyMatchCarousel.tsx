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
}

interface CompanyMatchCarouselProps {
  companies: CompanyMatch[];
}

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
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Top Company Matches
          </h2>

          <p className="text-sm text-gray-500">
            Companies where your resume has the strongest fit
          </p>
        </div>
      </div>

      {/* Filter controls for location, job type, and experience */}
      <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="flex-1 min-w-50">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Location
          </label>

          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="All">All Locations</option>
            <option value="CA">California</option>
            <option value="WA">Washington</option>
            <option value="NY">New York</option>
          </select>
        </div>

        <div className="flex-1 min-w-50">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Job Type
          </label>

          <select
            value={jobTypeFilter}
            onChange={(e) =>
              setJobTypeFilter(e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="flex-1 min-w-50">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Experience
          </label>

          <select
            value={experienceLevelFilter}
            onChange={(e) =>
              setExperienceLevelFilter(e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="All">All Levels</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Show empty state if no companies match the filters */}
      {filteredCompanies.length === 0 || !activeCompany ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm">
            No companies match your filters
          </p>
        </div>
      ) : (
        <>
          {/* Carousel navigation controls */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousCompany}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Company {currentIndex + 1} of{' '}
                {filteredCompanies.length}
              </p>
            </div>

            <button
              onClick={nextCompany}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Card showing details for the active company */}
          <motion.div
            key={activeCompany.company}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-linear-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100"
          >
            {/* Company name, match reason, and match score */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {activeCompany.company}
                </h3>

                <p className="text-sm text-gray-600">
                  {activeCompany.reason}
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-black text-indigo-600 mb-1">
                  {activeCompany.match}%
                </div>

                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">
                  Match Score
                </span>
              </div>
            </div>

            {/* Visual bar representing the match percentage */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${activeCompany.match}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
            </div>

            {/* Job details: location, type, experience, salary, team size */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-indigo-600" />
                {activeCompany.location}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                {activeCompany.jobType}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-indigo-600" />
                {activeCompany.experienceLevel}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                {activeCompany.salary}
              </div>

              <div className="flex items-center gap-2 text-sm col-span-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Team: {activeCompany.teamSize}
              </div>
            </div>

            {/* List of job requirements for this company */}
            <div>
              <h4 className="text-xs font-black text-gray-500 uppercase mb-3">
                Job Requirements
              </h4>

              <div className="space-y-2">
                {activeCompany.requirements.map(
                  (requirement, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{requirement}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              View Full Job Posting
            </button>
          </motion.div>
        </>
      )}

      {/* Summary count of filtered vs total companies */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Showing {filteredCompanies.length} of {companies.length}{' '}
        companies
      </div>
    </div>
  );
}