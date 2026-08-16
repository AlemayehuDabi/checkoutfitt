"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

/**
 * Listbox-style select. Native `<select>` can't be styled to the spec's
 * dropdown panel, so this is a custom widget with the matching ARIA roles and
 * keyboard behaviour (arrows, Home/End, Enter, Escape, type-ahead-free).
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  className,
  id,
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  /** Opens with the highlight already on the current selection. */
  function openMenu() {
    const index = options.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (!option) return;
    onChange?.(option.value);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (["Enter", " ", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
    }
  }

  return (
    <div className={cn("w-full", className)} ref={rootRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-[500] text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between gap-md rounded-md border border-border bg-surface px-lg text-body",
            "transition-colors duration-150 hover:border-border-strong",
            "focus-visible:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
            selected ? "text-text-primary" : "text-text-muted",
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-[18px] shrink-0 text-text-muted transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={`${selectId}-listbox`}
              role="listbox"
              aria-activedescendant={`${selectId}-opt-${activeIndex}`}
              initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute top-[calc(100%+4px)] left-0 z-50 max-h-[280px] w-full overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-lg"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    id={`${selectId}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => commit(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex h-10 cursor-pointer items-center justify-between rounded-sm px-md text-body",
                      isSelected
                        ? "bg-primary-50 font-[500] text-primary-500"
                        : "text-text-primary",
                      index === activeIndex && !isSelected && "bg-surface-secondary",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check aria-hidden className="size-4 shrink-0" />}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
