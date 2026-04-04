import { type ComponentWithAs, makePureBox } from "@codeday/topo/_utils";
import { type BoxProps } from "@codeday/topo/Atom";

export const Main: ComponentWithAs<"div", BoxProps> = makePureBox("Main", {
  role: "main",
});
