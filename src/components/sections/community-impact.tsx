import { loadCommunityImpactData } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

import { ProjectItem } from "./project-item";

const projectsData = loadCommunityImpactData();

const CommunityImpactSection = () => {
  return (
    <SectionComponent label="Community Impact">
      <div className="flex flex-col gap-4">
        {projectsData.featuredProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </SectionComponent>
  );
};
export default CommunityImpactSection;
