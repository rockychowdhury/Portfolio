import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rocky Chowdhury | Software Engineer",
  description:
    "Portfolio of Rocky Chowdhury — Software Engineer, Problem Solver, and Competitive Programmer with 700+ DSA problems solved.",
  keywords: [
    "Rocky Chowdhury",
    "Software Engineer",
    "Portfolio",
    "Full Stack Developer",
    "Competitive Programming",
  ],
  authors: [{ name: "Rocky Chowdhury" }],
  openGraph: {
    title: "Rocky Chowdhury | Software Engineer",
    description:
      "Software Engineer & Problem Solver — 700+ DSA problems solved, 10+ projects completed.",
    type: "website",
  },
  icons: {
    icon: "/assets/logo.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${anton.variable} antialiased selection:bg-foreground/10`}
    >
      <body className="bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
