import React, { useEffect, useRef, useState } from "react";
import useId from "@accessible/use-id";
import { type ComponentWithAs } from "@codeday/topo/_utils";
import { P as Text, type TextProps } from "./Text";

interface CopyTextProps extends TextProps {
  label: string;
}

const CopyText: ComponentWithAs<"p", CopyTextProps> = React.forwardRef<
  HTMLElement,
  CopyTextProps
>(({ children, label, ...props }, ref) => {
  const [width, setWidth] = useState(10);
  const myRef = ref || useRef(null);
  const id = useId();
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !myRef ||
      !(myRef as React.MutableRefObject<any>).current
    )
      return;
    setWidth((myRef as React.MutableRefObject<any>).current.scrollWidth);
  }, [typeof window, myRef, children]);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <Text
        {...(props as any)}
        ref={myRef as React.MutableRefObject<any>}
        id={id}
        as="input"
        type="text"
        value={children as string}
        width={`${width}px`}
        bg="transparent"
        readOnly
        onClick={(e: any) => {
          (e.target as HTMLInputElement).select();
          (e.target as HTMLInputElement).setSelectionRange(
            0,
            (e.target as HTMLInputElement).value.length + 1,
          );
          window.document.execCommand("copy");
        }}
      />
    </>
  );
}) as ComponentWithAs<"p", CopyTextProps>;
CopyText.displayName = "CopyText";
export { CopyText, type CopyTextProps };
