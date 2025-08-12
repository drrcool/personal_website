import { SectionComponent } from "../ui/SectionLabel";

import PublicationsButton from "./publications-button";
import ResumeButton from "./resume-button";

const ResumeAndPublicationsSection = () => {
  return (
    <SectionComponent label="Resume & Publications">
      <div className="flex flex-col md:flex-row gap-2 my-8 justify-center items-center">
        <ResumeButton />
        <PublicationsButton />
      </div>
    </SectionComponent>
  );
};

export default ResumeAndPublicationsSection;
