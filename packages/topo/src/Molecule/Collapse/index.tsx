import { Collapsible } from "@chakra-ui/react";
import React from "react";

interface CollapseProps {
  in?: boolean;
  open?: boolean;
  children?: React.ReactNode;
  unmountOnExit?: boolean;
  [key: string]: any;
}

export const Collapse: React.FC<CollapseProps> = ({
  in: inProp,
  open,
  unmountOnExit,
  children,
  ...props
}) => (
  <Collapsible.Root open={open ?? inProp ?? false} lazyMount={unmountOnExit} {...props}>
    <Collapsible.Content>{children}</Collapsible.Content>
  </Collapsible.Root>
);
