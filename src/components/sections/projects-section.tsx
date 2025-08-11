import { loadProjectsData, type Project } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

const ProjectItem = ({ project }: { project: Project }) => {
  return (
    <div className={"border  rounded-lg p-4"}>
      <div>{project.title}</div>
    </div>
  );
};

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
