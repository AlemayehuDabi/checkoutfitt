"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  inputSize?: "md" | "lg";
  /** Renders a show/hide toggle and manages the type internally. */
  passwordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      icon,
      inputSize = "md",
      passwordToggle = false,
      className,
      id,
      type = "text",
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [revealed, setRevealed] = React.useState(false);

    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    const resolvedType = passwordToggle && revealed ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-[500] text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-lg -translate-y-1/2 text-text-muted [&>svg]:size-[18px]"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full cursor-text rounded-md border bg-surface text-body text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
              "hover:border-border-strong",
              "focus:border-primary-500 focus:shadow-sm focus:outline-none",
              "disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-60",
              inputSize === "lg" ? "h-13" : "h-11",
              icon ? "pl-11" : "pl-lg",
              passwordToggle ? "pr-11" : "pr-lg",
              error ? "border-danger" : "border-border",
              className,
            )}
            {...props}
          />

          {passwordToggle && (
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-md -translate-y-1/2 cursor-pointer rounded-full p-1 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {revealed ? (
                <EyeOff aria-hidden className="size-[18px]" />
              ) : (
                <Eye aria-hidden className="size-[18px]" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-caption text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-caption text-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, id, ...props }, ref) {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-[500] text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full cursor-text rounded-md border bg-surface p-lg text-body text-text-primary",
            "placeholder:text-text-muted",
            "transition-colors duration-150 hover:border-border-strong",
            "focus:border-primary-500 focus:shadow-sm focus:outline-none",
            error ? "border-danger" : "border-border",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-caption text-danger">{error}</p>}
      </div>
    );
  },
);
