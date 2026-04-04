import { Grid, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React from "react";

interface TextOnlyProps {
  names: string[];
  [key: string]: any;
}

export default function TextOnly({ names, ...props }: TextOnlyProps) {
  return (
    <Content {...props}>
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
          xl: "repeat(5, minmax(0, 1fr))",
        }}
        columnGap={4}
        rowGap={1}
      >
        {names.map((name) => (
          <Text mb={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {name}
          </Text>
        ))}
      </Grid>
    </Content>
  );
}
