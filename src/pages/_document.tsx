import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="theme-1 font-theme-1">
      <Head>
        <meta
          name="description"
          content="Personal website of Dr. Richard Cool"
        />
        <link rel="icon" href="/image/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Lato:ital,wght@0,400;0,700;0,900;1,300;1,700&family=Poppins:ital,wght@0,400;0,600;0,900;1,700&family=Raleway:ital,wght@0,300;0,400;0,600;0,700;0,900;1,800&display=swap"
          rel="stylesheet"
        />{" "}
        <link
          href="https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Dosis:wght@200;300;400;500;600;700;800&family=Fira+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Montserrat+Alternates:wght@100;400;500;700&family=Open+Sans:wght@400;500;600;700;800&family=Roboto:ital,wght@0,400;0,900;1,400;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;600;700&family=Inconsolata:wght@400;600;900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Main />
      <body>
        <NextScript />
      </body>
    </Html>
  );
}

Document();
