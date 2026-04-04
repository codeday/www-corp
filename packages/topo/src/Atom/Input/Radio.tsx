import React from "react";
import {
  RadioGroup as ChakraRadioGroup,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
export { Stack, HStack, VStack };

interface RadioProps {
  isChecked?: boolean;
  onClick?: (e?: any) => void;
  onChange?: (e?: any) => void;
  children?: React.ReactNode;
  value?: string;
  [key: string]: any;
}

export const Radio: React.FC<RadioProps> = ({
  isChecked,
  onClick,
  onChange,
  children,
  value = "_radio_item_",
  ...props
}) => (
  <ChakraRadioGroup.Root
    value={isChecked ? value : ""}
    onValueChange={(details: { value: string }) => {
      if (details.value === value) {
        onClick?.();
        onChange?.({ target: { value } });
      }
    }}
  >
    <ChakraRadioGroup.Item value={value} {...props}>
      <ChakraRadioGroup.ItemHiddenInput />
      <ChakraRadioGroup.ItemIndicator />
      {children != null && (
        <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  </ChakraRadioGroup.Root>
);

export const RadioGroup = ChakraRadioGroup.Root;
