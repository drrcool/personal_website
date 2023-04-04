import React, { useMemo } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import getColorTheme, { ThemeName } from "../../styles/themeConfig"
import { GlobalStyle } from "../../styles/globalStyle";
import useLocalStorage from "./useLocalStorage";
const LOCAL_STORAGE_KEY = 4;

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const DEFAULT_THEME = "dark";
    const fontFamily = "DynaPuff; sans-serif";
    const [theme, setTheme] = useLocalStorage<ThemeName>(
        `rcooldotcom-themeName-${LOCAL_STORAGE_KEY}`,
        DEFAULT_THEME
    );

    const themeValue: DefaultTheme = useMemo(() => ({
        colors: getColorTheme(theme),
        fontFamily,
        setTheme,

    }), [theme, setTheme, fontFamily])

    return (
        <ThemeProvider theme={themeValue}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    )
}

export default ThemeContextProvider;
