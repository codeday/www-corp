import { List as ChakraList } from "@chakra-ui/react";
import React from "react";

export const List = ChakraList.Root;
export const ListItem = ChakraList.Item;
export const ListIcon = ChakraList.Indicator;
export const OrderedList: React.FC<any> = (props) => <ChakraList.Root as="ol" {...props} />;
export const UnorderedList: React.FC<any> = (props) => <ChakraList.Root as="ul" {...props} />;
