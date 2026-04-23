import { createElement, ReactNode, ElementType } from "react";

interface StaticContentProps {
  children?: ReactNode;
  element?: string | ElementType;
  [key: string]: any;
}

// This no longer works in React 18, but is left in place for compatibiltiy.
export default function StaticContent({ children, element = "div", ...props }: StaticContentProps) {
  return createElement(element as any, {
    ...props,
    children,
  });
}
