import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ThemeToggleButton from './ThemeToggleButton';

interface HeaderProp {
    path: string;
    label: string;
}

const headerConfig: Array<HeaderProp> = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Thoughts' },
    { path: '/Experience', label: 'Experience' },
];


// Generate a link from an entry in headerConfig
const StyledNavLink = styled.div`
    font-size: 1.2rem;
    flex-basis: 100%;
    font-weight: bold;
    width: max-content;
  `;
const StyledLinkAnchor = styled.a < { isActive: boolean }> `
    color: ${(props) =>
        props.isActive
            ? props.theme.colors.activeNavLink
            : props.theme.colors.navLink};
    &:hover,
    &:focus {
      color: ${(props) => props.theme.colors.hoverNavLink};
      background-color: transparent;
      text-decoration: underline;
    }
  `;
const NavLink = ({ path, label }: HeaderProp) => {
    const { asPath: currentPath } = useRouter();

    return (
        <StyledNavLink>
            <Link href={path}>
                <StyledLinkAnchor isActive={path === currentPath}>
                    {label}
                </StyledLinkAnchor>
            </Link>
        </StyledNavLink >
    )
}

// Parse headerConfig and return a list of links
const NavBarEntryDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 60%
`
const NavBarEntries = ({ headerConfig }: { headerConfig: Array<HeaderProp> }) => {
    return (
        <NavBarEntryDiv>
            {headerConfig.map((entry) => <NavLink key={entry.path} path={entry.path} label={entry.label} />)}
        </NavBarEntryDiv>
    )

}

// Construct the Header
const HeaderDiv = styled.div`
  height: 5vh;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: right;
  padding-left: 50px;
  padding-right: 50px;
  top:0;
  left: 0;
  background-color : ${(props) => props.theme.colors.bgPrimary}
`
const Header = () => {

    return (
        <HeaderDiv>
            <NavBarEntries headerConfig={headerConfig} />
            <ThemeToggleButton />
        </HeaderDiv>
    )

}
export default Header
