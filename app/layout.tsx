import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { CloudFlareAnalytics } from "./components/CloudFlareAnalytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ScrollToTop from "./components/scroll-to-top";
import Image from "next/image";
// import LavaBackground from "./components/LavaBackground";

// @TODO: Create OG photo
export const metadata: Metadata = {
  title: {
    default: "janigowski.dev",
    template: "%s :: janigowski.dev",
  },
  description: "Product Engineer. Software Architect. Frontend. Creative.",
  openGraph: {
    title: "janigowski.dev",
    description:
      "Product Engineer. Software Architect. Frontend. Creative.",
    url: "https://janigowski.dev",
    siteName: "janigowski.dev",
    images: [
      {
        url: "https://janigowski.dev/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "janigowski",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <body
        className="relative min-h-screen bg-black print:bg-white"
      >
        <div className="fixed inset-0 w-full h-full -z-[2] print:hidden">
          <Image
            src="/janigowski-large-wallpaper.jpg"
            alt="Background"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div
          className="fixed inset-0 w-full h-full pointer-events-none z-[100] print:hidden"
          style={{
            backgroundImage: "url('/film-grain.svg')",
            backgroundRepeat: "repeat",
            opacity: 0.18
          }}
        />
        {/* <LavaBackground /> */}
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <ScrollToTop />
          <CloudFlareAnalytics />
          <VercelAnalytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
