import React from "react";
import { Collapsible } from "@chakra-ui/react";

interface CollapseProps {
  in?: boolean;
  open?: boolean;
  animateOpacity?: boolean;
  children?: React.ReactNode;
  unmountOnExit?: boolean;
  [key: string]: any;
}

export const Collapse: React.FC<CollapseProps> = ({
  in: inProp,
  open,
  animateOpacity,
  unmountOnExit,
  children,
  ...props
}) => (
  <Collapsible.Root open={open ?? inProp ?? false} lazyMount={unmountOnExit} {...props}>
    <Collapsible.Content>{children}</Collapsible.Content>
  </Collapsible.Root>
);
