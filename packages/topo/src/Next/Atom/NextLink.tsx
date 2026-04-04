import { type LinkProps } from "@chakra-ui/react";
import { Link } from "@codeday/topo/Atom";
import NextJsLink, { type LinkProps as NextJsLinkProps } from "next/link";
import React from "react";

type NextLinkProps = LinkProps & Omit<NextJsLinkProps, "passHref" | "legacyBehavior">;

export const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ href = "", replace, scroll, shallow, prefetch, locale, ...props }, ref) => {
    return (
      <NextJsLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        passHref
        legacyBehavior
      >
        <Link ref={ref as any} {...(props as any)} />
      </NextJsLink>
    );
  },
);
