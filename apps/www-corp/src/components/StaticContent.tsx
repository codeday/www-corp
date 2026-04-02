import {
  createElement, useRef, useState, useEffect, ReactNode, ElementType,
} from 'react';

function useStaticContent(): [boolean, React.RefObject<HTMLElement>] {
  const ref = useRef<HTMLElement>(null);
  const [render, setRender] = useState(typeof window === 'undefined');

  useEffect(() => {
    // check if the innerHTML is empty as client side navigation
    // need to render the component without server-side backup
    const isEmpty = (ref.current as HTMLElement).innerHTML === '';
    if (isEmpty) {
      setRender(true);
    }
  }, []);

  return [render, ref];
}

interface StaticContentProps {
  children?: ReactNode;
  element?: string | ElementType;
  [key: string]: any;
}

export default function StaticContent({ children, element = 'div', ...props }: StaticContentProps) {
  const [render, ref] = useStaticContent();

  // if we're in the server or a spa navigation, just render it
  if (render) {
    return createElement(element as any, {
      ...props,
      children,
    });
  }

  // avoid re-render on the client
  return createElement(element as any, {
    ...props,
    ref,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: '' },
  });
}
