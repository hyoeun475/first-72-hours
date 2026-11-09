import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/features/session/SessionProvider";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "첫 72시간",
  description: "디지털 성범죄 피해 초기 대응을 돕는 안내 도구",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#15181e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
