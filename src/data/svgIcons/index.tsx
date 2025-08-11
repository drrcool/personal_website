// Export all icon components from the svgIcons directory
import { DruidIcon } from "./apachedruid";
import { SparkIcon } from "./apachespark";
import { D3Icon } from "./d3";
import { NodeIcon } from "./nodedotjs";
import { PandasIcon } from "./pandas";
import { PostgreSQLIcon } from "./postgresql";
import { PythonIcon } from "./python";
import { ReactIcon } from "./react";
import { ScikitLearnIcon } from "./scikitlearn";
import { TrinoIcon } from "./trino";
import { TypeScriptIcon } from "./typescript";

export const getTechIcon = (
  tech: string
): (({ className }: { className: string }) => React.ReactElement) => {
  switch (tech) {
    case "Python":
      return PythonIcon;
    case "Trino":
      return TrinoIcon;
    case "Scikit-learn":
      return ScikitLearnIcon;
    case "React":
      return ReactIcon;
    case "PostgreSQL":
      return PostgreSQLIcon;
    case "Pandas":
      return PandasIcon;
    case "Spark":
      return SparkIcon;
    case "D3.js":
      return D3Icon;
    case "Node.js":
      return NodeIcon;
    case "Druid":
      return DruidIcon;
    case "TypeScript":
      return TypeScriptIcon;
    default:
      return function DefaultIcon({
        className: _className,
      }: {
        className: string;
      }) {
        return <div>Icon</div>;
      };
  }
};
