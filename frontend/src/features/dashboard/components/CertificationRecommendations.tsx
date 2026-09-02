type Certification = {
  name: string;
  full_name: string;
  provider: string | null;
  url: string | null;
};

type CertificationRecommendationsProps = {
  matched: Certification[];
  missingRequired: Certification[];
  missingOptional: Certification[];
};

export default function CertificationRecommendations({
  matched,
  missingRequired,
  missingOptional,
}: CertificationRecommendationsProps) {
  const missingCerts = [...missingRequired, ...missingOptional];

  const renderCert = (cert: Certification) => (
    <div
      key={cert.name}
      className="rounded-xl p-4 flex items-center justify-between border bg-orange-50 border-orange-100"
    >
      <div>
        <p className="font-medium text-gray-900">
          {cert.full_name}
        </p>

        {cert.provider && (
          <p className="text-xs text-gray-400 mt-1">
            {cert.provider}
          </p>
        )}
      </div>

      {cert.url ? (
        <a
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          Learn more →
        </a>
      ) : (
        <span className="text-xs text-gray-400">
          No link yet
        </span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Certification Recommendations
      </h3>

      {missingCerts.length === 0 ? (
        <p className="text-sm text-gray-500">You already have all recommended certifications for this role.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {missingCerts.map((cert) => renderCert(cert))}
        </div>
      )}
    </div>
  );
}
