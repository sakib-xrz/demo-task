"use client";

import { useId } from "react";

export function SemiCircleGauge({
  value,
  max = 100,
}: {
  value: number;
  max?: number;
}) {
  const gid = useId().replace(/:/g, "");
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = 68;
  const cx = 100;
  const cy = 95;
  const arcLen = Math.PI * r;
  const dash = (pct / 100) * arcLen;

  return (
    <svg
      viewBox="0 0 200 110"
      className="mx-auto h-auto w-full max-w-[210px]"
      aria-hidden
    >
      <defs>
        <linearGradient id={`gg-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c3ddfb" />
          <stop offset="50%" stopColor="#6aadf5" />
          <stop offset="100%" stopColor="#1a6de3" />
        </linearGradient>
      </defs>
      {/* Background track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#e8ecf2"
        strokeWidth="18"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={`url(#gg-${gid})`}
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${arcLen + 1}`}
      />
    </svg>
  );
}
