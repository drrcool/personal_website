import { loadProjectsData } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

import { ProjectItem } from "./project-item";

// TODO: Add link if there's a link for the project
// TODO: Add tags for any technologies (if they are present)

const projectsData = loadProjectsData();

const ProjectsSection = () => {
  return (
    <SectionComponent label="Projects">
      <div className="flex flex-col gap-4">
        {projectsData.featuredProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </SectionComponent>
  );
};
export default ProjectsSection;
