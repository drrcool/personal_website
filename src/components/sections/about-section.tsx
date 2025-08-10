import { loadAboutData, type AboutData } from "@/lib/data-loader";

import { SectionLabel } from "../ui/SectionLabel";

import TechStackIcons from "./tech-stack-icons";

const aboutData: AboutData = loadAboutData();

const AboutSection = () => {
  return (
    <section id="about" className="py-6 pb-4 border-b border-gray-800">
      <SectionLabel label="About" />
      <p className="text-lg text-gray-100 mb-4">{aboutData.lead}</p>
      <p className="text-gray-400 mb-6">{aboutData.description}</p>
      <TechStackIcons />
    </section>
  );
};

export default AboutSection;
