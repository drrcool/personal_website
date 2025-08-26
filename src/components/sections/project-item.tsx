import type { Project } from "@/lib/data-loader";

export const ProjectLink = ({
  link,
  linkTitle,
}: {
  link: string;
  linkTitle: string | undefined;
}) => {
  return (
    <a
      className="cursor-pointer underline text-primary"
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
