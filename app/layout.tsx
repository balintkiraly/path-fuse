import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathFuse - Merge & clean your GPX tracks",
  description:
    "Upload multiple GPX files, clean GPS errors, merge tracks into a smooth route, and view detailed statistics and similarity scores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-slate-700 relative`}
      >
        <Providers>
          <div className="min-h-screen bg-slate-50 pb-16">
            <Navigation />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
