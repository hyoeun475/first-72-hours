"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { copyText } from "@/lib/export";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

type Tone = "neutral" | "warn" | "danger" | "accent";
const toneClass: Record<Tone, string> = {
  neutral: "border-border bg-surface",
  warn: "border-warn/40 bg-warn-soft text-foreground",
  danger: "border-danger/40 bg-danger-soft text-foreground",
  accent: "border-accent/40 bg-accent-soft text-foreground",
};

export function Notice({
  tone = "neutral",
  icon,
  title,
  children,
}: {
  tone?: Tone;
  icon?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div role={tone === "danger" ? "alert" : "note"} className={`rounded-lg border p-3 text-sm ${toneClass[tone]}`}>
      {title && (
        <p className="mb-1 font-semibold">
          {icon && <span aria-hidden="true">{icon} </span>}
          {title}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}

const btnBase =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50";
const btnVariant = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "border border-border bg-surface hover:bg-accent-soft",
  danger: "border border-danger/50 text-danger hover:bg-danger-soft",
  ghost: "text-accent-strong hover:bg-accent-soft",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btnVariant }) {
  return <button type="button" className={`${btnBase} ${btnVariant[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
  external,
}: {
  href: string;
  variant?: keyof typeof btnVariant;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = `${btnBase} ${btnVariant[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "ok" : "fail");
        setTimeout(() => setState("idle"), 2000);
      }}
      aria-live="polite"
    >
      {state === "ok" ? "복사됨 ✓" : state === "fail" ? "복사 실패 - 직접 선택해 복사해 주세요" : label}
    </Button>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-accent";

/** 민감한 내용은 기본적으로 접힌 상태로 보여준다. */
export function Collapsible({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="group rounded-lg border border-border">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium marker:content-none">
        <span aria-hidden="true" className="mr-2 inline-block transition group-open:rotate-90">
          ▸
        </span>
        {summary}
      </summary>
      <div className="border-t border-border px-3 py-2 text-sm">{children}</div>
    </details>
  );
}
