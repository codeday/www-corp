import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useReducer,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";

const SCRIPT_SRC = "https://www.cognitoforms.com/f/seamless.js";

declare global {
  interface Window {
    Cognito: {
      mount: (
        formId: string,
        selector: string,
      ) => {
        on: (event: string, handler: () => void) => ReturnType<Window["Cognito"]["mount"]>;
        prefill: (data: Record<string, unknown>) => void;
      };
    };
  }
}

function useStateRef<T>(val: T) {
  const ref = useRef<T>(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}

function useIsBrowser(): boolean {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);
  return isBrowser;
}

const genId = (parts: (string | number)[]) =>
  "id-" + parts.map((p) => p.toString().replace(/[^a-zA-Z0-9]/g, "")).join("-");

function useId(parts: (string | number)[]): string {
  const [id, setId] = useState(genId(parts));
  useEffect(() => {
    setId(genId(parts));
  }, parts);
  return id;
}

interface FormProps {
  accountId: string;
  formId: string | number;
  css?: ((id: string) => string) | string | null;
  prefill?: Record<string, unknown> | null;
  loading?: ReactElement | null;
  onReady?: () => void;
  onSubmit?: () => void;
  onPageChange?: () => void;
}

const Form = ({
  accountId,
  formId,
  css = null,
  prefill = null,
  loading = null,
  onReady = () => {},
  onSubmit = () => {},
  onPageChange = () => {},
}: FormProps) => {
  const isBrowser = useIsBrowser();
  const id = useId([accountId, formId]);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    if (containerRef.current) {
      containerRef.current.style.height = "0";
      containerRef.current.style.overflow = "hidden";
    }
  }, [accountId, formId]);

  const [retry, nextRetry] = useReducer((prev: number) => prev + 1, 0);
  useEffect(() => {
    if (containerRef.current) return () => {};
    const retrierTimeout = setTimeout(nextRetry, 350 * retry);
    return () => clearTimeout(retrierTimeout);
  }, [retry]);

  const setIsLoadedRef = useStateRef<Dispatch<SetStateAction<boolean>>>(setIsLoaded);
  const onReadyRef = useStateRef(onReady);
  const onSubmitRef = useStateRef(onSubmit);
  const onPageChangeRef = useStateRef(onPageChange);
  const prefillRef = useStateRef(prefill);

  const formContainer = useMemo(
    () => (
      <div id={id + "-parent"} ref={containerRef} style={{ height: 0, overflow: "hidden" }}>
        <div id={id} />
      </div>
    ),
    [id, isBrowser],
  );

  const cssContainer = useMemo(
    () => <style type="text/css">{typeof css === "function" ? css(id + "-parent") : css}</style>,
    [id, css],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const cfScript = document.createElement("script");
    cfScript.src = SCRIPT_SRC;
    cfScript.dataset.key = accountId;
    cfScript.dataset.form = formId.toString();
    cfScript.addEventListener("load", () => {
      window.Cognito.mount(formId.toString(), `#${id}`)
        .on("ready", () => {
          setIsLoadedRef.current(true);
          if (onReadyRef.current) {
            onReadyRef.current();
            if (containerRef.current) {
              containerRef.current.style.height = "auto";
              containerRef.current.style.overflow = "initial";
            }
          }
        })
        .on("afterSubmit", () => onSubmitRef.current())
        .on("afterNavigate", () => onPageChangeRef.current())
        .prefill(prefillRef.current || {});
    });
    containerRef.current.children[0]?.appendChild(cfScript);
  }, [id, formId, accountId, containerRef.current, typeof window]);

  if (!isBrowser) return loading;

  return (
    <React.Fragment>
      {!isLoaded && loading}
      {cssContainer}
      {formContainer}
      <div style={{ display: "none" }}>{retry}</div>
    </React.Fragment>
  );
};

export default Form;
