import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Aura - AI-Powered Document Management",
  description: "Optimize your resume with AI-powered insights and ATS compatibility analysis.",
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Navbar />

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )
}