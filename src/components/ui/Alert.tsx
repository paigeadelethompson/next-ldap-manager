"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const alertVariants = {
  default: "bg-white text-gray-900",
  destructive: "border-red-500/50 text-red-600 bg-red-50",
  warning: "border-yellow-500/50 text-yellow-600 bg-yellow-50",
  success: "border-green-500/50 text-green-600 bg-green-50",
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
}

function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm",
        alertVariants[variant],
        className,
      )}
      role="alert"
      {...props}
    />
  );
}

export { Alert };
