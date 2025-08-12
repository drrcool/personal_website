import { SectionComponent } from "../ui/SectionLabel";

import ResumeButton from "./resume-button";

const ResumeAndPublicationsSection = () => {
  return (
    <SectionComponent label="Resume & Publications">
      <div className="flex flex-column md:flex-row gap-2 my-8 justify-center items-center">
        <ResumeButton />
      </div>
    </SectionComponent>
  );
};

export default ResumeAndPublicationsSection;
