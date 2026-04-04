import React from "react";
import { Switch as ChakraSwitch } from "@chakra-ui/react";

interface SwitchProps {
  isChecked?: boolean;
  checked?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  onChange?: (e: { target: { checked: boolean } }) => void;
  onCheckedChange?: (details: { checked: boolean }) => void;
  children?: React.ReactNode;
  [key: string]: any;
}

export const Switch: React.FC<SwitchProps> = ({
  isChecked,
  checked,
  isDisabled,
  disabled,
  onChange,
  onCheckedChange,
  children,
  ...props
}) => (
  <ChakraSwitch.Root
    checked={checked ?? isChecked}
    disabled={disabled ?? isDisabled}
    onCheckedChange={(details: { checked: boolean }) => {
      onCheckedChange?.(details);
      onChange?.({ target: { checked: details.checked } });
    }}
    {...props}
  >
    <ChakraSwitch.HiddenInput />
    <ChakraSwitch.Control>
      <ChakraSwitch.Thumb />
    </ChakraSwitch.Control>
    {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
  </ChakraSwitch.Root>
);
