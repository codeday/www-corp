import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { useSsr } from "@codeday/topo/utils";
/* eslint-disable no-undef */
import React from "react";

export const ClientSideOnlyBox: ComponentWithAs<"div", BoxProps> = React.forwardRef<
  HTMLDivElement,
  BoxProps
>((({ children, ...props }: any, ref: any) => {
  const isSsr = useSsr();
  return isSsr ? null : (
    <Box {...(props as any)} ref={ref as any}>
      {children}
    </Box>
  );
}) as any) as ComponentWithAs<"div", BoxProps>;
