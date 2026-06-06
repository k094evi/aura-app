'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Building2, ChevronDown } from 'lucide-react';

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
  'ServiceNow', 'Workday', 'HubSpot', 'Zendesk', 'Splunk',
];

interface CompanySelectorProps {
  selectedCompanies: string[];
  onSelectionChange: (companies: string[]) => void;
}

export default function CompanySelector({
  selectedCompanies,
  onSelectionChange,
}: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = COMPANIES.filter((company) =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      onSelectionChange(
        selectedCompanies.filter((c) => c !== company)
      );
    } else {
      onSelectionChange([...selectedCompanies, company]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
        Target Companies (Optional)
      </label>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-14 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center gap-2 flex-wrap"
        >
          {selectedCompanies.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-400 flex-1">
              <Building2 className="w-5 h-5" />
              <span>Select companies you're targeting...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedCompanies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg"
                >
                  {company}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectionChange(
                        selectedCompanies.filter(
                          (c) => c !== company
                        )
                      );
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl"
            >
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <button
                    key={company}
                    type="button"
                    onClick={() => toggleCompany(company)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {company}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}