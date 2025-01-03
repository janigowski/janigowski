import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import Image from "next/image";

// @TODO: Create OG photo
export const metadata: Metadata = {
  title: {
    default: "janigowski.dev",
    template: "%s | janigowski.dev",
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
        className={`relative min-h-screen bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <div className="fixed inset-0 w-full h-full -z-[1]">
          <Image
            src="/janigowski-large-wallpaper.jpg"
            alt="Background"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
