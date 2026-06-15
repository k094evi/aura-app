import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { ConditionalLayout } from "@/components/ConditionalLayout";

// Page metadata used for SEO and browser tab title
export const metadata = {
  title: "Aura - AI-Powered Document Management",
  description: "Optimize your resume with AI-powered insights and ATS compatibility analysis.",
}

// Load the Noto Sans font with the needed weights
const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={noto.className}>
        {/* Wraps pages with layout that varies based on the current route */}
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}