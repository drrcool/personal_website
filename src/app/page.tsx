import BannerImage from "@/components/layout/banner";
import Sidebar from "@/components/layout/sidebar";
import AboutSection from "@/components/sections/about-section";
import CommunityImpactSection from "@/components/sections/community-impact";
import ExperienceSection from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import ResumeAndPublicationsSection from "@/components/sections/resume-and-pubs";
import { loadPersonalData, type PersonalData } from "@/lib/data-loader";

export default function Home(): React.ReactElement {
  const personalData: PersonalData = loadPersonalData();

  return (
    <>
      <BannerImage />
      <div className="flex flex-col md:flex-row gap-0">
        <Sidebar personalData={personalData} />
        <div className="container px-8 py-5 sm:mx-6 sm:px-6 lg:mx-10 lg:px-8 lg:pl-0">
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <CommunityImpactSection />
          <ResumeAndPublicationsSection />
        </div>
      </div>
    </>
  );
}
