import { ThemeConfig, ThemeName } from "./styles/themeConfig"
import "styled-components"

// And extend them!
declare module "styled-components" {
  export interface DefaultTheme {
	colors: ThemeConfig;
	fontFamily: string;
	setTheme: (a: ThemeName) => void;
	theme: ThemeName;
  }
}
