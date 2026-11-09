"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "처음" },
  { href: "/guide", label: "가이드" },
  { href: "/records", label: "기록" },
  { href: "/summary", label: "정리" },
  { href: "/resources", label: "지원기관" },
  { href: "/safety", label: "안전" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            첫 72시간
          </Link>
          <div className="flex items-center gap-2">
            {pathname !== "/" && (
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent-soft"
              >
                ← 뒤로
              </button>
            )}
            <Link
              href="https://www.google.com"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-strong"
              title="이 화면을 빠르게 벗어납니다. 방문 기록은 지워지지 않을 수 있습니다."
            >
              빠른 나가기
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {children}
      </main>

      <nav aria-label="주요 화면" className="sticky bottom-0 border-t border-border bg-surface">
        <ul className="mx-auto grid w-full max-w-xl grid-cols-6">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block py-3 text-center text-xs ${
                    active ? "font-semibold text-accent-strong underline underline-offset-4" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
