import { loadAboutData, type AboutData } from "@/lib/data-loader";

const aboutData: AboutData = loadAboutData();

const AboutSection = () => {
  return (
    <section id="about" className="py-6 pb-4 border-b border-gray-800">
      <div className="text-xl text-primary uppercase tracking-widest mb-4 font-medium">
        About
      </div>
      <p className="text-lg text-gray-100 mb-4">{aboutData.lead}</p>
      <p className="text-gray-400 mb-6">{aboutData.description}</p>
    </section>
  );
};

export default AboutSection;
