import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Richard Diaz-Cool | Analytics Engineer",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "Analytics Engineer and full-stack developer with deep expertise in data engineering, machine learning, and modern web development. Specializing in Python, React, Apache Spark, and cloud architectures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
