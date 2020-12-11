import { useState, useEffect } from 'react';
import { apiFetch } from '@codeday/topo/utils';

export default function useTwitch() {
  const [data, setData] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};

    const updateTwitch = async () => {
      const result = await apiFetch(`query {
        twitch {
          live {
            title
            username
            viewerCount
            thumbnailSm: thumbnail(width: 640, height: 480)
            thumbnailLg: thumbnail(width: 1920, height: 1080)
          }
        }
      }`);
      setData(result?.twitch?.live || {});
    }
    updateTwitch();
    const interval = setInterval(updateTwitch, 60 * 1000);
    return () => clearInterval(interval);
  }, [typeof window]);

  return data;
}
