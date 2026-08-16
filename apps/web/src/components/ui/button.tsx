"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHADOW_PRIMARY } from "@/lib/motion";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-text-on-primary shadow-[0_4px_14px_rgba(193,98,45,0.25)] hover:bg-primary-400 active:bg-primary-600",
  // 1.5px border per spec — Tailwind has no scale step for it.
  secondary:
    "border-[1.5px] border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 active:bg-primary-100",
  outline:
    "border border-border text-text-primary bg-surface hover:border-border-strong hover:bg-surface-secondary",
  ghost: "text-text-secondary hover:text-text-primary hover:underline",
  danger:
    "border-[1.5px] border-danger text-danger bg-transparent hover:bg-danger-light",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-body-semibold gap-2",
  lg: "h-13 px-8 text-body-semibold gap-2",
};

/** Shared by Button and ButtonLink so both render identically. */
function buttonStyles(
  variant: Variant,
  size: Size,
  fullWidth: boolean,
  className?: string,
) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center rounded-lg font-[600] whitespace-nowrap",
    "transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    const reduce = useReducedMotion();
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        // The lift is only on primary, where the coloured glow makes it read.
        whileHover={
          reduce || isDisabled || variant !== "primary"
            ? undefined
            : { y: -1, boxShadow: SHADOW_PRIMARY }
        }
        whileTap={reduce || isDisabled ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={buttonStyles(variant, size, fullWidth, className)}
        {...props}
      >
        {loading ? (
          <Loader2 aria-hidden className="size-4 animate-spin" />
        ) : (
          iconLeft
        )}
        {children}
        {!loading && iconRight}
      </motion.button>
    );
  },
);

/**
 * A link that looks like a button.
 *
 * Wrapping <Button> in a <Link> renders <a><button>, which is invalid HTML
 * (interactive content inside an anchor) and gives the same control two tab
 * stops. This renders a single anchor with the button's styling instead. The
 * hover lift is CSS rather than Framer, since there's no motion element here.
 */
export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={cn(
          buttonStyles(variant, size, fullWidth, className),
          variant === "primary" &&
            "hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(193,98,45,0.25)]",
          "active:translate-y-0",
        )}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Link>
    );
  },
);

/** Circular icon-only button — a surface-secondary disc appears on hover. */
export interface IconButtonProps extends HTMLMotionProps<"button"> {
  label: string;
  size?: "sm" | "md";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, size = "md", className, children, ...props }, ref) {
    const reduce = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full text-text-secondary",
          "transition-colors duration-150 hover:bg-surface-secondary hover:text-text-primary",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-40",
          size === "sm" ? "size-9" : "size-10",
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
