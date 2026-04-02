import { type ComponentWithAs } from "@chakra-ui/react";
import { makePureBox } from "@codeday/topo/_utils";
import {type BoxProps} from "@codeday/topo/Atom";

export const Main: ComponentWithAs<"div", BoxProps> = makePureBox("Main", { role: "main" });
