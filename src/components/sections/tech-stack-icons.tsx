import { chartColors } from "@/data/chartColors/categorical-colors";
import { getTechIcon } from "@/data/svgIcons";
import { loadTechStackData, type TechStackData } from "@/lib/data-loader";

import { SVGIcon } from "../ui/icon";
const TechStackIcons = () => {
  const techStackData: TechStackData = loadTechStackData();
  const { technologies } = techStackData;
  const MAX_ENTRIES_IN_ROW = 7;
  // Group technologies into rows of MAX_ENTRIES_IN_ROW
  const rows = [];
  for (let i = 0; i < technologies.length; i += MAX_ENTRIES_IN_ROW) {
    rows.push(technologies.slice(i, i + MAX_ENTRIES_IN_ROW));
  }
  console.log(chartColors);

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          <div className="flex gap-4">
            {row.map((tech, itemIndex) => (
              <SVGIcon
                key={tech}
                size="small"
                style={{
                  color: chartColors[rowIndex * MAX_ENTRIES_IN_ROW + itemIndex],
                }}
                image={getTechIcon(tech)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackIcons;
