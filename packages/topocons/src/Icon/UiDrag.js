"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiDrag = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@chakra-ui/react");
const UiDrag = (props) => (0, jsx_runtime_1.jsx)(react_1.Icon, { fill: "currentColor", viewBox: "0 0 24 24", ...props, children: (0, jsx_runtime_1.jsx)("path", { d: "M13 4.414V11h6.586l-1.293-1.293a1 1 0 1 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L19.586 13H13v6.586l1.293-1.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L11 19.586V13H4.414l1.293 1.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L4.414 11H11V4.414L9.707 5.707a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 1 1-1.414 1.414z" }) });
exports.UiDrag = UiDrag;
