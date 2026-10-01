import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { StartupQRLoader } from "@/components/StartupQRLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Page Replacement Algorithms — FIFO vs LRU",
  description:
    "An Apple-inspired interactive educational experience for Operating Systems. Explore FIFO and LRU page replacement algorithms, physical memory dynamics, and Belady's anomaly.",
  openGraph: {
    title: "Page Replacement Algorithms — FIFO vs LRU",
    description:
      "When memory runs out, which page should leave? An interactive exploration of FIFO and LRU.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Replacement Algorithms — FIFO vs LRU",
    description:
      "When memory runs out, which page should leave? An interactive exploration of FIFO and LRU.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
        <ThemeProvider>
          {children}
          <StartupQRLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}
