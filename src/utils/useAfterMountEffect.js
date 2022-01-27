import React, { useEffect, useRef } from 'react';

export const useAfterMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}
