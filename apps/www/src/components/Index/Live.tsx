import { Box, RatioBox } from "@codeday/topo/Atom";
import React, { useState, useEffect } from "react";

interface LiveProps {
  username: string;
  [key: string]: any;
}

export default function Live({ username, ...props }: LiveProps) {
  const [parent, setParent] = useState("www.codeday.org");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setParent(window.location.host);
  }, [typeof window]);

  if (!username || !parent) return <></>;

  return (
    <Box
      as="a"
      {...({ href: `https://twitch.tv/${username}`, target: "_blank", rel: "noopener" } as any)}
      {...(props as any)}
    >
      <RatioBox
        as="iframe"
        w={16}
        h={9}
        auto="h"
        autoDefault="480"
        {...({
          src: `https://player.twitch.tv/?channel=${username}&parent=${parent}&muted=true&autoplay=true`,
          frameBorder: 0,
          scrolling: "no",
          allowFullScreen: false,
          style: { pointerEvents: "none" },
        } as any)}
      />
    </Box>
  );
}
