import "./globals.css";
import { Suspense } from "react";
import { DM_Sans } from "next/font/google";
import { ConditionalLayout } from "@/components/ConditionalLayout";

// Page metadata used for SEO and browser tab title
export const metadata = {
  title: "Aura - AI-Powered Document Management",
  description: "Optimize your resume with AI-powered insights and ATS compatibility analysis.",
};

// Load DM Sans (the font used in the Figma design) with the needed weights
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        {/* Wraps pages with layout that varies based on the current route.
            Suspense is required because ConditionalLayout uses useSearchParams. */}
        <Suspense fallback={null}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Suspense>
      </body>
    </html>
  );
}