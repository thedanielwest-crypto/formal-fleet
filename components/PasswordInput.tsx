"use client";

import { useState } from "react";
import { Icon } from "@/components/BrandIcon";

/**
 * Password field with a show/hide "eye" toggle. Used on every log-in and
 * password screen (driver, school, student, admin, reset) so they all
 * behave the same way.
 */
export default function PasswordInput({
  id,
  value,
  onChange,
  className,
  placeholder,
  autoComplete = "current-password",
  required = true,
  autoFocus,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        className={`${className} pr-12`}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-muted hover:text-ink"
      >
        <Icon name={show ? "eyeOff" : "eye"} className="w-5 h-5" />
      </button>
    </div>
  );
}
