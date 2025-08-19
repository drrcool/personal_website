import { loadProjectsData, type Project } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

// TODO: Add link if there's a link for the project
// TODO: Add tags for any technologies (if they are present)

export const ProjectLink = ({
  link,
  linkTitle,
}: {
  link: string;
  linkTitle: string | undefined;
}) => {
  return (
    <a
      className="cursor-pointer text-accent-foreground"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {linkTitle ?? link}
    </a>
  );
};

export const ProjectTags = ({ technologies }: { technologies: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {technologies.map((technology) => (
        <div
          key={technology}
          className="text-sm bg-accent/10 rounded-md px-2 py-1"
        >
          {technology}
        </div>
      ))}
    </div>
  );
};

export const ProjectItem = ({ project }: { project: Project }) => {
  return (
    <div
      className={
        "border-gray-700 border  bg-secondary/10 rounded-lg p-4 flex flex-col gap-3"
      }
    >
      <div className="text-lg font-bold">{project.title}</div>
      <div className="flex flex-col gap-2 pl-4">
        <div>{project.description}</div>
        {project.link && (
          <ProjectLink link={project.link} linkTitle={project.linkTitle} />
        )}
        {project.technologies && (
          <ProjectTags technologies={project.technologies} />
        )}
      </div>
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
