import { loadAboutData, type AboutData } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

import TechStackIcons from "./tech-stack-icons";

const aboutData: AboutData = loadAboutData();

const AboutSection = () => {
  return (
    <SectionComponent label="About">
      <p className="text-lg text-gray-100 mb-4">{aboutData.lead}</p>
      <p className="text-gray-400 mb-6">{aboutData.description}</p>
      <TechStackIcons />
    </SectionComponent>
  );
};

export default AboutSection;
