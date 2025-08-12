"use client";

import Image from "next/image";
import Link from "next/link";

import { type PersonalData } from "@/lib/data-loader";
import { useSmoothScroll } from "@/lib/hooks/use-smooth-scroll";

interface SidebarProps {
  personalData: PersonalData;
  mainPage?: boolean;
}

const Sidebar = ({ personalData, mainPage = false }: SidebarProps) => {
  const { scrollToSection } = useSmoothScroll();
  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <aside className="md:sticky md:top-6 md:h-[calc(100vh-48px)] flex flex-col justify-start md:justify-between border-b md:border-b-0 md:border-r border-border px-6 md:pr-6 md:pl-6 pt-8 pb-8 md:pb-0">
      <div className="identity">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center md:justify-start">
          <div className="w-40 h-40 md:w-60 md:h-60">
            <Image
              src="/images/profile/hero-portrait.jpg"
              alt={personalData.name}
              width={240}
              height={240}
              className="w-full h-full rounded-full object-cover border-2 border-border bg-slate-900"
            />
          </div>
        </div>

        {/* Name and Title */}
        <h1 className="text-2xl md:text-2xl font-bold tracking-tight mb-2 text-foreground text-center md:text-left">
          {personalData.name}
        </h1>
        <div className="text-muted-foreground text-base mb-1 text-center md:text-left">
          {personalData.title}
        </div>
        <div className="text-muted-foreground text-base mb-4 text-center md:text-left">
          {personalData.company}
        </div>

        {/* Social Links */}
        <div className="social-links flex justify-center items-center">
          <div
            className="flex justify-center md:justify-start gap-4 items-center"
            aria-label="Social links"
          >
            <Link
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors p-2"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Link
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors p-2"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link
              href={`mailto:${personalData.email}`}
              className="text-muted-foreground hover:text-accent transition-colors p-2"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Navigation - Hidden on mobile */}
        {mainPage && (
          <nav aria-label="Primary navigation" className="my-6 hidden md:block">
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavClick("About")}
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("Experience")}
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("Projects")}
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
                >
                  Projects
                </button>
              </li>
              {/* <li>
              <button
                onClick={() => handleNavClick("Side Projects")}
                className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
              >
                Side Projects
              </button>
            </li> */}
              <li>
                <button
                  onClick={() => handleNavClick("Community Impact")}
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
                >
                  Community Impact
                </button>
              </li>
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume PDF in a new tab"
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full cursor-default"
                >
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="/publications"
                  aria-label="Open publications page"
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full cursor-default"
                >
                  Publications
                </a>
              </li>
            </ul>
          </nav>
        )}
        {!mainPage && (
          <nav
            aria-label="Secondary navigation"
            className="my-6 hidden md:block"
          >
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  aria-label="Open main page"
                  className="text-foreground font-medium hover:text-accent transition-colors text-left w-full cursor-default"
                >
                  About Me
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
