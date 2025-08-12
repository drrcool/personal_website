import BannerImage from "@/components/layout/banner";
import Sidebar from "@/components/layout/sidebar";
import PublicationsSection from "@/components/sections/publications-section";
import {
  loadPersonalData,
  loadPublicationsData,
  type PersonalData,
} from "@/lib/data-loader";

const personalData: PersonalData = loadPersonalData();
const publicationsData = loadPublicationsData();
export default function Home(): React.ReactElement {
  return (
    <>
      <BannerImage />
      <div className="flex flex-col md:flex-row gap-0">
        <Sidebar personalData={personalData} />
        <div className="container px-8 py-5 sm:mx-6 sm:px-6 lg:mx-10 lg:px-8 lg:pl-0">
          <PublicationsSection publications={publicationsData} />
        </div>
      </div>
    </>
  );
}
