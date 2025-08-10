import BannerImage from "@/components/layout/banner";
import Sidebar from "@/components/layout/sidebar";
import AboutSection from "@/components/sections/about-section";

export default function Home(): React.ReactElement {
  return (
    <>
      <BannerImage />
      <div className="flex flex-col lg:flex-row gap-0">
        <Sidebar />
        <div className="container mx-4 px-4 py-5 sm:mx-6 sm:px-6 lg:mx-10 lg:px-8 lg:pl-0">
          <AboutSection />
        </div>
      </div>
    </>
  );
}
