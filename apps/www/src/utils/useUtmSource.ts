import { useRouter } from "next/router";

export function useUtmSource(): string {
  const { query } = useRouter();
  const vars: Record<string, string | string[] | undefined> = {
    s: query?.utm_source || query?.ref,
    m: query?.utm_medium,
    c: query?.utm_campaign,
    o: query?.utm_content,
    t: query?.utm_term,
  };
  return Object.keys(vars)
    .filter((k) => vars[k])
    .map((k) => `${k}:${vars[k]}`)
    .join(",");
}
