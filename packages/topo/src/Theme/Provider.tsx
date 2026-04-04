import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";
import { Global, css } from "@emotion/react";
// @ts-ignore
import PropTypes from "prop-types";
/* eslint-disable no-undef */
import React from "react";
import useSwr from "swr";
import { apiFetch } from "@codeday/topo/utils";

import codedaySystem, { Theme as codedayTheme } from "./vars";
import { QueryProvider } from "./query";
import {
  ThemeDataProvider,
  defaultFontSizes,
  type ThemeData,
} from "@codeday/topo/utils";
import { CmpProvider } from "./providers/Cmp";

const customCss = css`
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.woff") format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.ttf")
        format("truetype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.woff")
        format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.ttf")
        format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.woff")
        format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.ttf")
        format("truetype");
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "Gosha Sans";
    font-weight: 700;
    src:
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.woff")
        format("woff"),
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Fira Code";
    src:
      url("https://f1.codeday.org/topo/fonts/firacode-bold-webfont.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/firacode-bold-webfont.woff")
        format("woff");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Fira Code";
    src:
      url("https://f1.codeday.org/topo/fonts/firacode-regular-webfont.woff2")
        format("woff2"),
      url("https://f1.codeday.org/topo/fonts/firacode-regular-webfont.woff")
        format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const STRINGS = [
  "legal.cookies",
  "legal.ccpa",
  "legal.data.pii",
  "legal.data.payment",
  "eco.link",
  "common.more-info",
  "resources",
  "custom-links",
  "copyright",
  "nonprofit",
  "maintained-by",
  "made-with-love",
];

const query = `query PageQuery ($locale: String!, $stringKeys: [String!]!, $localizationConfig: String!) {
  cms {
    strings (locale: $locale, where: { key_in: $stringKeys } ) {
      items {
        key
        value
      }
    }

    sites(where: { type: "Public", display_contains_all: "Footer" }, locale: $locale) {
      items {
        sys {
          id
        }
        title
        link
      }
    }

    localizationConfig(id: $localizationConfig, locale: $locale) {
      contactDefaultType
      contactDefaultValue
    }
  }
}`;

export interface ProviderProps {
  analyticsId?: string | null;
  brandColor?: string | null;
  withChat?: boolean;
  visibility?: string;
  initialColorMode?: string | null;
  useSystemColorMode?: boolean;
  /** @deprecated Cookie-based color mode is no longer supported in v3. */
  cookies?: any;
  children?: React.ReactNode;
  locale?: string;
  localizationConfig?: string;
}

const Provider = ({
  brandColor = null,
  visibility = "Public",
  children,
  locale,
  localizationConfig,
}: ProviderProps) => {
  // Fetch translation strings
  const { data } = useSwr(
    [
      query,
      {
        locale: locale ?? "en-US",
        stringKeys: STRINGS,
        localizationConfig: localizationConfig ?? "2guv6EfbM9qu5y5ER52pVN",
      },
    ],
    apiFetch,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  let strings: Record<string, string> = {};
  if (data?.cms?.strings?.items) {
    strings = data.cms.strings.items.reduce(
      (accum: any, node: any) => ({ ...accum, [node.key]: node.value }),
      {},
    );
  }

  // Handle brandColor (mutates theme object — same behaviour as v2)
  if (brandColor && brandColor in codedayTheme.colors) {
    codedayTheme.colors.brand = codedayTheme.colors[brandColor][600];
  }

  const themeData: ThemeData = {
    colors: codedayTheme.colors,
    fonts: codedayTheme.fonts,
    fontSizes: defaultFontSizes,
    space: codedayTheme.space || {},
    radii: codedayTheme.radii || {
      none: "0",
      sm: "0.125rem",
      base: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
    cognito: codedayTheme.cognito,
    config: codedayTheme.config,
    visibility,
    strings,
    programWebname: undefined,
  };

  return (
    <ChakraProvider value={codedaySystem}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storage="none"
        followSystem
      >
        <ThemeDataProvider value={themeData}>
          <Global styles={customCss} />
          <script src="https://www.cognitoforms.com/f/seamless.js" defer />
          <QueryProvider value={data}>
            <CmpProvider>{children}</CmpProvider>
          </QueryProvider>
        </ThemeDataProvider>
      </NextThemesProvider>
    </ChakraProvider>
  );
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  analyticsId: PropTypes.string,
  brandColor: PropTypes.string,
  visibility: PropTypes.string,
  initialColorMode: PropTypes.string,
};

/** @deprecated Cookie-based SSR color mode is no longer needed with next-themes. */
function getServerSideProps({ req }: any) {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
}

export { getServerSideProps, Provider as ThemeProvider };
export type { ProviderProps as ThemeProviderProps };
