import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "StadiumAI — FIFA World Cup 2026 Operations",
    template: "%s | StadiumAI",
  },
  description:
    "AI-powered stadium operations platform for FIFA World Cup 2026. Real-time crowd management, emergency response, smart navigation, and predictive intelligence.",
  keywords: [
    "FIFA World Cup 2026",
    "Stadium AI",
    "Crowd Management",
    "Emergency Response",
    "Smart Stadium",
    "GenAI",
  ],
  authors: [{ name: "StadiumAI Team" }],
  openGraph: {
    title: "StadiumAI — FIFA World Cup 2026 Operations",
    description:
      "AI-powered stadium operations platform for FIFA World Cup 2026",
    type: "website",
    siteName: "StadiumAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "StadiumAI — FIFA World Cup 2026 Operations",
    description:
      "AI-powered stadium operations platform for FIFA World Cup 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#1B3A5C" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
