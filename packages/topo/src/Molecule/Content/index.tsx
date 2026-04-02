import React from "react";
import { pureRef } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { type ComponentWithAs } from "@chakra-ui/react";

interface ContentProps extends BoxProps {
  wide?: boolean;
  full?: boolean;
}

const Content: ComponentWithAs<"div", ContentProps> = pureRef<
  ContentProps,
  "div"
>(({ wide, full, ...props }, ref) => {
  const boxProps: any = {
    paddingLeft: 3,
    paddingRight: 3,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 6,
    maxW: full ? "none" : wide ? "container.xl" : "container.lg",
    width: "100%",
    ref,
    ...props,
  };
  return <Box {...boxProps} />;
});
Content.displayName = "Content";
export { Content, type ContentProps };
