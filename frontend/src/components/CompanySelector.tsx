'use client';

import { useState, useRef, useEffect, FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Building2, ChevronDown } from "lucide-react";

const COMPANIES = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta',
  'Netflix', 'Tesla', 'Nvidia', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Intel', 'Cisco', 'SAP',
  'Uber', 'Airbnb', 'Spotify', 'Shopify', 'Stripe',
  'Dropbox', 'Slack', 'Zoom', 'LinkedIn', 'Twitter',
  'Reddit', 'Pinterest', 'Snapchat', 'TikTok', 'Discord',
  'PayPal', 'Square', 'Coinbase', 'Robinhood', 'Figma',
  'Notion', 'Atlassian', 'GitHub', 'GitLab', 'MongoDB',
  'Snowflake', 'Databricks', 'Cloudflare', 'Twilio', 'Okta',
  'ServiceNow', 'Workday', 'HubSpot', 'Zendesk', 'Splunk'
];

interface CompanySelectorProps {
  selectedCompanies: string[];
  onSelectionChange: (companies: string[]) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedCompanies,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = COMPANIES.filter(company =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      onSelectionChange(selectedCompanies.filter(c => c !== company));
    } else {
      onSelectionChange([...selectedCompanies, company]);
    }
  };

  const removeCompany = (company: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedCompanies.filter(c => c !== company));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
        Target Companies (Optional)
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[56px] w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors flex items-center gap-2 flex-wrap"
        >
          {selectedCompanies.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-400 flex-1">
              <Building2 className="w-5 h-5" />
              <span>Select companies you're targeting...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedCompanies.map(company => (
                <span
                  key={company}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
                >
                  {company}
                  <button
                    onClick={(e) => removeCompany(company, e)}
                    className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredCompanies.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No companies found
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredCompanies.map(company => {
                      const isSelected = selectedCompanies.includes(company);
                      return (
                        <button
                          key={company}
                          onClick={() => toggleCompany(company)}
                          className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                            isSelected ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <span className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                            {company}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedCompanies.length > 0 && (
        <p className="mt-2 text-xs text-gray-500 text-left">
          {selectedCompanies.length} {selectedCompanies.length === 1 ? 'company' : 'companies'} selected
        </p>
      )}
    </div>
  );
};
