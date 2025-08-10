import BannerImage from "@/components/layout/banner";
import Sidebar from "@/components/layout/sidebar";
import AboutSection from "@/components/sections/about-section";
import { loadPersonalData, type PersonalData } from "@/lib/data-loader";

export default function Home(): React.ReactElement {
  const personalData: PersonalData = loadPersonalData();

  return (
    <>
      <BannerImage />
      <div className="flex flex-col md:flex-row gap-0">
        <Sidebar personalData={personalData} />
        <div className="container mx-4 px-4 py-5 sm:mx-6 sm:px-6 lg:mx-10 lg:px-8 lg:pl-0">
          <AboutSection />
        </div>
      </div>
    </>
  );
}
