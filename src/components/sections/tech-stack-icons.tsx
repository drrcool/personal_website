import { chartColors } from "@/data/chartColors/categorical-colors";
import { getTechIcon } from "@/data/svgIcons";
import { loadTechStackData, type TechStackData } from "@/lib/data-loader";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { SVGIcon } from "../ui/icon";

const TechStackIcon = ({
  tech,
  color,
}: {
  tech: string;
  color: string | undefined;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <SVGIcon size="small" image={getTechIcon(tech)} style={{ color }} />
      </HoverCardTrigger>
      <HoverCardContent className="bg-muted/80 backdrop-blur-sm text-center w-auto min-w-fit px-3 py-2">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{tech}</h4>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const TechStackIcons = () => {
  const techStackData: TechStackData = loadTechStackData();
  const { technologies } = techStackData;

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-1 md:gap-2 justify-center max-w-full overflow-hidden px-2 md:px-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl">
        {technologies.map((tech, itemIndex) => (
          <TechStackIcon
            key={tech}
            tech={tech}
            color={chartColors[itemIndex]}
          />
        ))}
      </div>
    </div>
  );
};

export default TechStackIcons;
