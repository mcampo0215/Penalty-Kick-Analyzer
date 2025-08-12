"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
  children?: React.ReactNode;
}

export function ShineBorder({
  borderWidth = 2,
  duration = 6,
  shineColor = ["#c0c0c0", "#f5f5f5", "#999999"],
  className,
  children,
}: ShineBorderProps) {
  const gradient =
    Array.isArray(shineColor) ? shineColor.join(", ") : shineColor;

  return (
    <div
      className={cn("relative p-[2px] rounded-2xl overflow-hidden", className)}
      style={{
        background: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: "200% 200%",
        animation: `glow ${duration}s linear infinite`,
      }}
    >
      <style jsx>{`
        @keyframes glow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div className="rounded-2xl bg-zinc-800">{children}</div>
    </div>
  );
}
