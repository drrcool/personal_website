export type BaseThemeConfig = {
    bgPrimary: string;
    sectionBackground: string;
    accent1: string;
    accent2: string;
    accent3: string;
    textPrimary: string;
};

const dark = {
    bgPrimary: "#000000",
    sectionBackground: "#24201F",
    accent1: "#F00380",
    accent2: "#FA682C",
    accent3: "#56A3C5",
    textPrimary: "#E0E0E1",
};

const light = {
    bgPrimary: "#FFFFFF",
    sectionBackground: "#f5f5ce",
    accent1: "#70f",
    accent2: "#FA682C",
    accent3: "#131ac5",
    textPrimary: "#000000",
};

export type ThemeConfig = {
    textPrimary: string;
    bgPrimary: string;
    sectionBackground: string;
    activeNavLink: string;
    navLink: string;
    hoverNavLink: string;
    headerUtilityButtonPrimary: string;
    headerUtilityButtonSecondary: string;
};

const colorTable = (theme: BaseThemeConfig): ThemeConfig => ({
    textPrimary: theme.textPrimary,
    bgPrimary: theme.bgPrimary,
    sectionBackground: theme.sectionBackground,
    activeNavLink: theme.accent3,
    navLink: theme.textPrimary,
    hoverNavLink: theme.accent2,
    headerUtilityButtonPrimary: theme.accent1,
    headerUtilityButtonSecondary: theme.accent2,
});

const enum ThemeNames {
    dark,
    light,
}
export type ThemeName = keyof typeof ThemeNames;

const themeLookup: { [key: string]: BaseThemeConfig } = { dark, light };

const getColorTheme = (themeName: string) => {
    const baseTheme = themeLookup[themeName];
    return colorTable(baseTheme);
};
export default getColorTheme;
