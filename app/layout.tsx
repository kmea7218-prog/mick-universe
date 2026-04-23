import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import AIFloater from "@/components/AIFloater";

export const metadata: Metadata = {
  title: "米克宇宙 · Mick Universe",
  description: "米克乳牛專科診所的戰情儀表板",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen relative">
        <div className="mesh-bg" />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 pl-64">
            <div className="max-w-[1400px] mx-auto px-8 py-8">{children}</div>
          </main>
        </div>
        <AIFloater />
      </body>
    </html>
  );
}
