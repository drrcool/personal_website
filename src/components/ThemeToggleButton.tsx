import styled, { useTheme } from 'styled-components'
import { IconContext } from "react-icons"
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs"
const ThemeButton = styled.button`
background-color: transparent;
border: none;
outline: none;
`

const ThemeToggleButton = () => {
    const theme = useTheme()
    console.log(theme)
    // TODO: add an icon instead of text
    return (
        <IconContext.Provider value={{ size: "20px", color: theme.colors.headerUtilityButtonPrimary, style: { verticalAlign: 'middle' } }}>
            <ThemeButton
                onClick={() => { theme.setTheme(theme.theme === 'light' ? 'dark' : 'light') }}
            >
                {theme.theme === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
            </ThemeButton>
        </IconContext.Provider>
    )
}

export default ThemeToggleButton
