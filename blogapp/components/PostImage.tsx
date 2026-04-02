"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function PostImage({ src, alt, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        <ImageOff className="h-10 w-10" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover w-full h-full ${className}`}
    />
  );
}
