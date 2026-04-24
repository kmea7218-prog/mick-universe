import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

const TRIP_SYSTEM = `你是一位熟悉新加坡的親子旅遊顧問。

旅程：2026 年 8 月 Chu Yu + 另一位家長 + Mick（5 歲）三人，高雄出發，5 天 4 夜。
主題：獅城報復性五日遊 · 八月熱帶爽吃爽玩 · YuxChuxMick

五日大綱：
Day 1 (8/10 一)：KHH → Changi → Jewel → 飯店（Fairmont / PARKROYAL / Shangri-La Garden Wing）→ 松發肉骨茶 → Spectra 水舞。
Day 2 (8/11 二)：Mandai — Singapore Zoo + River Wonders；可選 Night Safari。
Day 3 (8/12 三)：聖淘沙 — USS 環球影城 + Skyline Luge + 西樂索海灘 + Wings of Time。
Day 4 (8/13 四)：Gardens by the Bay（Cloud Forest / Flower Dome / 兒童戲水）+ ArtScience Future World + Jumbo Seafood 辣椒蟹 + MBS SkyPark。
Day 5 (8/14 五)：牛車水佛牙寺 → Maxwell 天天海南雞飯 → Orchard → Jewel → 回 KHH。

機票 8 月來回參考（經濟艙/人）：
- 星宇 JX（KHH 直飛 SIN）：TWD 18,000 – 26,000
- 長榮 BR（KHH 轉 TPE 或 TPE 直飛）：TWD 17,000 – 24,000
預算：三人含機票 TWD 11–12 萬。

回覆原則：
1. 繁體中文、親切、具體、可執行。
2. 永遠考量 5 歲 Mick 的體力、飲食（不吃辣）、安全、推車需求。
3. 價格用 SGD，同時附 TWD 換算。
4. 票價/時刻可能過時 → 提醒使用者官網最終確認。
5. 回覆 6 段內，清單優先。`;

export async function POST(req: NextRequest) {
  try {
    const { messages, fxRate } = await req.json();
    const system = fxRate
      ? `${TRIP_SYSTEM}\n\n今日匯率：1 SGD = ${Number(fxRate).toFixed(3)} TWD`
      : TRIP_SYSTEM;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b: any) => b.type === "text") as any;
    return NextResponse.json({ reply: textBlock?.text ?? "（無回應）" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
