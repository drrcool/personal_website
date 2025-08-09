import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Personal Website | Professional Portfolio",
  description:
    "Personal portfolio website built with Next.js, TypeScript, and modern design system. Showcasing professional experience and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
