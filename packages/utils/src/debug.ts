import debugFactory from "debug";

function hasDebugConfig() {
  return typeof window !== "undefined" ? !!window.localStorage?.debug : !!process.env.DEBUG;
}

function defaultEnableDebug() {
  if (
    !hasDebugConfig() &&
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENV !== "production"
  ) {
    debugFactory.enable("codeday:*");
  }
}

export function debug(nameParts: string[]) {
  defaultEnableDebug();
  return debugFactory(["codeday", ...nameParts].join(":"));
}
