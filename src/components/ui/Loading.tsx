"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

export function Loading({
  size = "md",
  text,
  fullScreen,
  className,
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        fullScreen && "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-blue-600 border-t-transparent",
          sizeClasses[size],
        )}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function LoadingSpinner({
  size = "md",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-4 border-gray-200 border-t-blue-600",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
