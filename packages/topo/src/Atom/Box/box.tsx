import React from "react";
import {
  Box as ChakraBox,
  type BoxProps as ChakraBoxProps,
} from "@chakra-ui/react";
import { useTheme } from "@codeday/topo/utils";
import {
  dereferenceDottedString,
  type ComponentWithAs,
} from "@codeday/topo/_utils";

interface BoxProps extends ChakraBoxProps {
  grad?: string;
  visuallyHidden?: boolean;
}

const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ grad, visuallyHidden, ...props }, ref) => {
    const theme = useTheme();
    const hiddenProps = {
      fontSize: "0",
      width: "1px",
      height: "1px",
      display: "inline-block",
      overflow: "hidden",
      border: "none",
      padding: "0",
      margin: "0",
    };
    return (
      <ChakraBox
        ref={ref as any}
        bgImg={
          grad ? dereferenceDottedString(grad, theme.colors?.grad) : undefined
        }
        {...props}
        {...(visuallyHidden ? hiddenProps : {})}
      />
    );
  },
) as ComponentWithAs<"div", BoxProps>;

export { Box, type BoxProps };
