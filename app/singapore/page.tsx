"use client";

import { useState } from "react";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";

export default function SingaporePage() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-white" : "-mx-8 -my-8"}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <a
          href="/singapore-trip/index.html"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-mick-violet/15 text-xs font-semibold text-mick-violet hover:bg-mick-violet hover:text-white transition flex items-center gap-1.5 shadow-mick-sm"
          title="在新分頁開啟"
        >
          <ExternalLink size={12} /> 新分頁
        </a>
        <button
          onClick={() => setFullscreen((v) => !v)}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-mick-violet/15 text-xs font-semibold text-mick-violet hover:bg-mick-violet hover:text-white transition flex items-center gap-1.5 shadow-mick-sm"
          title={fullscreen ? "結束全螢幕" : "全螢幕"}
        >
          {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          {fullscreen ? "縮小" : "全螢幕"}
        </button>
      </div>

      <iframe
        src="/singapore-trip/index.html"
        className={fullscreen ? "w-full h-full border-0" : "w-full border-0"}
        style={fullscreen ? undefined : { height: "calc(100vh - 0px)" }}
        title="獅城報復性五日遊 · YuxChuxMick"
      />
    </div>
  );
}
