// src/components/common/Button.jsx
import React from "react";

/** 간단한 class join helper */
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button
 * props:
 * - children
 * - onClick
 * - type ("button"|"submit"|"reset")
 * - className: 추가 커스터마이징
 * - variant: 'primary' | 'outline' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - isLoading: boolean
 * - ariaLabel: string (선택)
 * - ...rest
 */
export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  ariaLabel,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: "bg-indigo-600 text-white focus-visible:ring-indigo-500",
    outline: "bg-white border border-gray-200 text-gray-800 focus-visible:ring-indigo-300",
    ghost: "bg-transparent text-indigo-600 focus-visible:ring-indigo-200",
  };

  const disabledClass = "opacity-60 cursor-not-allowed pointer-events-none";

  const classes = cx(
    base,
    sizes[size] ?? sizes.md,
    variants[variant] ?? variants.primary,
    disabled || isLoading ? disabledClass : "",
    className
  );

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (typeof onClick === "function") onClick(e);
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      aria-label={ariaLabel}
      {...rest}
    >
      {isLoading && (
        <svg
          className={cx("-ml-1 mr-2 h-4 w-4 animate-spin", variant === "primary" ? "text-white" : "text-indigo-600")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}

      <span>{children}</span>
    </button>
  );
}
