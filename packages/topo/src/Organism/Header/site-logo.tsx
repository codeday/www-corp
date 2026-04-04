import { reactChildrenMapRecursive } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

export default function SiteLogo({ children, ...props }: BoxProps) {
  return (
    <Box fontSize="4xl" lineHeight={0} {...props}>
      {reactChildrenMapRecursive(children, (child) =>
        React.cloneElement(child as React.ReactElement),
      )}
    </Box>
  );
}
SiteLogo.displayName = "SiteLogo";
