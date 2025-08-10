import Image from "next/image";
import Link from "next/link";

interface PersonalData {
  name: string;
  title: string;
  company: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

// Mock data - replace with actual data loading
const personalData: PersonalData = {
  name: "Richard Diaz-Cool",
  title: "Data Solutions Architect",
  company: "Netflix",
  tagline: "Astronomer turned data solutions architect",
  location: "San Jose, CA",
  email: "richardjcool@gmail.com",
  linkedin: "https://www.linkedin.com/in/richardjcool/",
  github: "https://github.com/drrcool",
  resume: "/placeholder.pdf",
};

const Sidebar = () => {
  return (
    <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] flex flex-col justify-start lg:justify-between border-b lg:border-b-0 lg:border-r border-border px-6 lg:pr-6 lg:pl-6 pt-8 pb-8 lg:pb-0">
      <div className="identity">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center lg:justify-start">
          <div className="w-40 h-40 lg:w-60 lg:h-60">
            <Image
              src="/images/profile/hero-portrait.jpg"
              alt="Richard Diaz-Cool"
              width={240}
              height={240}
              className="w-full h-full rounded-full object-cover border-2 border-border bg-slate-900"
            />
          </div>
        </div>

        {/* Name and Title */}
        <h1 className="text-2xl lg:text-2xl font-bold tracking-tight mb-2 text-foreground text-center lg:text-left">
          {personalData.name}
        </h1>
        <div className="text-muted-foreground text-base mb-1 text-center lg:text-left">
          {personalData.title}
        </div>
        <div className="text-muted-foreground text-base mb-4 text-center lg:text-left">
          {personalData.company}
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav aria-label="Primary navigation" className="mb-6 hidden lg:block">
          <ul className="space-y-2.5">
            <li>
              <Link
                href="#about"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#experience"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                href="#projects"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#side-projects"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                Side Projects
              </Link>
            </li>
            <li>
              <Link
                href="#community"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                Community Impact
              </Link>
            </li>
            <li>
              <Link
                href="#resume-publications"
                className="text-foreground font-medium hover:text-accent transition-colors"
              >
                Resume & Publications
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Social Links - Hidden on mobile since you'll have floating nav */}
      <div className="social-links">
        <div
          className="flex justify-center lg:justify-start gap-3.5"
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
