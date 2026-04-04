import { NativeSelect } from "@chakra-ui/react";
import React from "react";

interface SelectProps {
  placeholder?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const Select: React.FC<SelectProps> = ({ placeholder, children, ...props }) => (
  <NativeSelect.Root {...props}>
    <NativeSelect.Field placeholder={placeholder}>{children}</NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
);
