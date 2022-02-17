/* eslint-disable no-undef */
import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@codeday/topo/Atom';

export default function OnlyVisibleBox({ children, ...props }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const onResize = () => setIsVisible(ref.current.offsetWidth > 0 || ref.current.offsetHeight > 0);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [ref, typeof window]);

  return (
    <Box {...props} ref={ref}>{isVisible && children}</Box>
  );
}
OnlyVisibleBox.propTypes = {
  children: PropTypes.oneOf([PropTypes.element, PropTypes.arrayOf(PropTypes.element)], PropTypes.string).isRequired,
};
