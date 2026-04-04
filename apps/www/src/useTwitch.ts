import { apiFetch } from "@codeday/topo/utils";
import { useState, useEffect } from "react";

export default function useTwitch(): any {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (typeof window === "undefined") return () => {};

    const updateTwitch = async () => {
      const result = await apiFetch(
        `query {
        twitch {
          live {
            title
            username
            viewerCount
            thumbnailSm: thumbnail(width: 640, height: 480)
            thumbnailLg: thumbnail(width: 1920, height: 1080)
          }
        }
      }`,
        {},
        {},
      );
      setData(result?.twitch?.live || {});
    };
    void updateTwitch();
    const interval = setInterval(updateTwitch, 60 * 1000);
    return () => clearInterval(interval);
  }, [typeof window]);

  return data;
}
