"use client";

import Image from "next/image";
import Link from "next/link";

import { type PersonalData } from "@/lib/data-loader";
import { useSmoothScroll } from "@/lib/hooks/use-smooth-scroll";

interface SidebarProps {
  personalData: PersonalData;
}

const Sidebar = ({ personalData }: SidebarProps) => {
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

        {/* Navigation - Hidden on mobile */}
        <nav aria-label="Primary navigation" className="mb-6 hidden md:block">
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
              <button
                onClick={() => handleNavClick("Resume & Publications")}
                className="text-foreground font-medium hover:text-accent transition-colors text-left w-full"
              >
                Resume & Publications
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Social Links - Hidden on mobile since you'll have floating nav */}
      <div className="social-links">
        <div
          className="flex justify-center md:justify-start gap-3.5"
          aria-label="Social links"
        >
          <Link
            href={personalData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:text-accent transition-colors"
          >
            GitHub
          </Link>
          <Link
            href={personalData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:text-accent transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href={`mailto:${personalData.email}`}
            className="text-muted-foreground text-sm hover:text-accent transition-colors"
          >
            Email
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
