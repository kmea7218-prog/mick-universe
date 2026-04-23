"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  ListTodo,
  Lightbulb,
  Bot,
  Scroll,
} from "lucide-react";

const nav = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/projects", label: "六大主軸", icon: Sparkles },
  { href: "/tasks", label: "任務列表", icon: ListTodo },
  { href: "/brainstorm", label: "腦力激盪", icon: Lightbulb },
  { href: "/ai", label: "AI 協作中控", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/60 backdrop-blur-xl border-r border-mick-violet/10 flex flex-col z-20">
      {/* Logo / Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-mick-violet/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-mick-gradient flex items-center justify-center shadow-mick-md group-hover:scale-105 transition-transform">
            <span className="text-white font-display font-bold text-xl">米</span>
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight">米克宇宙</div>
            <div className="text-[11px] text-ink-mute font-mono tracking-wider">MICK UNIVERSE</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group relative overflow-hidden
                ${
                  active
                    ? "bg-mick-gradient text-white shadow-mick-md"
                    : "text-ink-soft hover:bg-mick-violet/8 hover:text-mick-violet"
                }
              `}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && (
                <div className="absolute inset-0 bg-white/10 animate-pulse-soft pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Constitution footer */}
      <div className="mx-3 mb-6 p-4 rounded-2xl bg-gradient-to-br from-mick-violet/8 via-mick-purple/8 to-mick-magenta/8 border border-mick-violet/10">
        <div className="flex items-center gap-2 mb-2">
          <Scroll size={14} className="text-mick-violet" />
          <div className="text-[10px] font-mono tracking-widest text-mick-violet font-semibold">
            PURPOSE
          </div>
        </div>
        <div className="font-serif text-[13px] leading-relaxed text-ink">
          讓生命被珍惜，<br />
          讓價值不被浪費。
        </div>
      </div>
    </aside>
  );
}
