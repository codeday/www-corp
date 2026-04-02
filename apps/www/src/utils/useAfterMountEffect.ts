import { useEffect, useRef, DependencyList } from 'react';

export const useAfterMountEffect = (func: () => void, deps: DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}
