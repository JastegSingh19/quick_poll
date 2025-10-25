import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "QuickPoll",
  description: "Real-time opinion polling platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="w-full border-b border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <a href="/" className="font-bold text-xl tracking-tight">
                <span className="bg-hero-gradient bg-clip-text text-transparent">QuickPoll</span>
              </a>
              <nav className="space-x-4">
                <a className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition" href="/create">Create</a>
                <a className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark transition" href="/">Live</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60">
            Built fast with Next.js + FastAPI.
          </footer>
        </div>
      </body>
    </html>
  );
}
