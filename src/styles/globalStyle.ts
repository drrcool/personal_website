import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`

font-family: ${(props) => props.theme.fontFamily};
 font-size: 10px;
    @media (min-width: 512px) {
      font-size: 10px;
    }
    @media (min-width: 765px) {
      font-size: 12px;
    }
    @media (min-width: 1024px) {
      font-size: 12px;
    }
    @media (min-width: 1298px) {
      font-size: 14px;
    }
    @media (min-width: 1590px) {
      font-size: 14px;
    }
    @media (min-width: 2048px) {
      font-size: 16px;
    }
  html {
    box-sizing: border-box
  }

  * {
    font-family: inherit;
    box-sizing: inherit;
    margin:0;
    padding:0
  }

  a:active,
  a:hover,
  a:focus,
  a:visited {
    outline: 0 !important;
    outline-offset:0;
    text-decoration: none;
    color: ${(props) => props.theme.colors.textPrimary};
    background-color: transparent;
  }

  :root {
    color: ${(props) => props.theme.colors.textPrimary};
    background-color: ${(props) => props.theme.colors.bgPrimary};

      }


  *::before,
  *::after {
    box-sizing: inherit;
    margin:0;
    padding:0;
    position: absolute;
    content: " "
  };
`;
