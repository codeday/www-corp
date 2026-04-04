import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import React from "react";

interface CheckboxProps {
  isChecked?: boolean;
  checked?: boolean | "indeterminate";
  isDisabled?: boolean;
  disabled?: boolean;
  isIndeterminate?: boolean;
  colorScheme?: string;
  colorPalette?: string;
  onChange?: (e: { target: { checked: boolean } }) => void;
  onCheckedChange?: (details: { checked: boolean | "indeterminate" }) => void;
  children?: React.ReactNode;
  value?: string;
  [key: string]: any;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  checked,
  isDisabled,
  disabled,
  isIndeterminate,
  colorScheme,
  colorPalette,
  onChange,
  onCheckedChange,
  children,
  ...props
}) => (
  <ChakraCheckbox.Root
    checked={isIndeterminate ? "indeterminate" : (checked ?? isChecked)}
    disabled={disabled ?? isDisabled}
    colorPalette={colorPalette ?? colorScheme}
    onCheckedChange={(details: { checked: boolean | "indeterminate" }) => {
      onCheckedChange?.(details);
      onChange?.({ target: { checked: details.checked === true } });
    }}
    {...props}
  >
    <ChakraCheckbox.HiddenInput />
    <ChakraCheckbox.Control>
      <ChakraCheckbox.Indicator />
    </ChakraCheckbox.Control>
    {children != null && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
  </ChakraCheckbox.Root>
);

export { CheckboxGroup } from "@chakra-ui/react";
