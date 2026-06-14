"use client";

import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * <img> that fades (and de-blurs) in once decoded — premium "load" feel.
 * Handles already-cached images via the ref check so there is no flash.
 */
export function FadeImg({ className = "", style, alt = "", ...props }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      ref={(el) => {
        if (el?.complete) setLoaded(true);
      }}
      onLoad={(e) => {
        setLoaded(true);
        props.onLoad?.(e);
      }}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        filter: loaded ? "blur(0)" : "blur(12px)",
        transition: "opacity .7s ease, transform .7s ease, filter .7s ease",
      }}
    />
  );
}
