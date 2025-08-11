import Image from "next/image";

import { loadExperienceData, type ExperiencePosition } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

// Format:
// title: larger text, bold
// Company, Location: smaller text
// Duration/Time: same as above
// Achievements: bullet points
// Logo: left side with the same height as the section above the achievements

export const ExperienceHeader = ({
  position,
}: {
  position: ExperiencePosition;
}) => {
  return (
    <div className="flex flex-col gap-0">
      <div className="text-lg font-bold">{position.title}</div>
      <div className="text-sm text-gray-500">
        {position.company}, {position.location}
      </div>
      <div className="text-sm text-gray-500">{position.duration}</div>
    </div>
  );
};

export const ExperienceAchievements = ({
  achievements,
}: {
  achievements: string[];
}) => {
  return (
    <ul className="">
      {achievements.map((achievement) => (
        <li key={achievement} className="grid grid-cols-[auto_1fr] gap-3">
          <span className="text-gray-600 text-2xl leading-none mt-1">•</span>
          <span className="leading-relaxed">{achievement}</span>
        </li>
      ))}
    </ul>
  );
};

export const ExperienceLogo = ({ logo }: { logo: string }) => {
  return (
    <Image src={logo} alt={logo} className="w-16 h-16" width={50} height={50} />
  );
};

export const ExperienceDescription = ({
  description,
}: {
  description: string;
}) => {
  return <div className="text-md text-accent ">{description}</div>;
};

const ExperienceItem = ({ position }: { position: ExperiencePosition }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        <ExperienceLogo logo={position.companyLogo} />
        <div className="flex flex-col gap-2">
          <ExperienceHeader position={position} />
          <ExperienceDescription description={position.description} />
          <ExperienceAchievements achievements={position.achievements} />
        </div>
      </div>
    </div>
  );
};

const experienceData = loadExperienceData();
const ExperienceSection = () => {
  return (
    <SectionComponent label="Experience">
      <div className="flex flex-col gap-4">
        {experienceData.positions.map((position) => (
          <ExperienceItem key={position.id} position={position} />
        ))}
      </div>
    </SectionComponent>
  );
};
export default ExperienceSection;
