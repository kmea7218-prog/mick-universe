"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  gradient?: "violet" | "magenta" | "purple" | "blue";
  subtitle?: string;
}

const gradientClasses = {
  violet: "from-mick-violet to-mick-purple",
  magenta: "from-mick-magenta to-mick-orchid",
  purple: "from-mick-purple to-mick-magenta",
  blue: "from-mick-blue to-mick-violet",
};

export default function StatsCard({
  label,
  value,
  suffix,
  icon: Icon,
  gradient = "violet",
  subtitle,
}: Props) {
  // Animated number counter
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group relative bg-white rounded-3xl p-6 shadow-mick-sm hover:shadow-mick-md transition-all duration-300 border border-mick-violet/5 overflow-hidden">
      {/* Gradient accent corner */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${gradientClasses[gradient]} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]} flex items-center justify-center text-white shadow-mick-sm`}
          >
            <Icon size={20} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-widest text-ink-mute uppercase">
            {label}
          </div>
          <div className="flex items-baseline gap-1">
            <div className="font-display font-bold text-4xl gradient-text leading-none">
              {displayValue}
            </div>
            {suffix && (
              <div className="text-lg font-display font-semibold text-ink-soft">{suffix}</div>
            )}
          </div>
          {subtitle && <div className="text-xs text-ink-mute mt-2">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
