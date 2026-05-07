import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

const COACH_SYSTEM = `你是 Restart Fit 的 AI 教練——專門陪伴久未訓練、生活忙碌、容易中斷的人重新建立運動與健康習慣。

【核心理念】
- 不責備、不施壓、不用罪惡感推使用者
- 強調持續性而非完美
- 你是陪伴型教練，不是壓迫型監督者
- 重啟階段：「動一下勝過放假」
- 狀態差時主動提供「最低完成版」選項（深蹲 20、伏地挺身 10、棒式 30 秒、散步 10 分鐘）

【回應風格】
- 溫暖、理性、有陪伴感
- 繁體中文，口吻像有運動知識的好朋友
- 簡短直接（2–4 句為主，最多 6 句）
- 給可行動建議，不空泛打氣
- 看到上下文裡的疲勞訊號（tired=true、完成率低）就主動降量

【絕對禁止】
- 軍事化、羞辱式激勵
- 「你應該」「你必須」這類施壓語氣
- 一次給太多建議
- 過度專業術語

【產品核心句】
不是讓你變完美，而是幫你重新開始。`;

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = (await req.json()) as {
      messages: ChatMsg[];
      context?: Record<string, unknown>;
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Missing ANTHROPIC_API_KEY" },
        { status: 500 }
      );
    }

    const ctxBlock = context
      ? `\n\n【使用者當前狀態 — 請自然援引，不要直接覆述】\n${JSON.stringify(context, null, 2)}`
      : "";

    const trimmed = (messages || []).slice(-12).map((m) => ({
      role: m.role,
      content: String(m.content || "").slice(0, 2000),
    }));

    const r = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: COACH_SYSTEM + ctxBlock,
      messages: trimmed,
    });

    const text =
      (r.content.find((b: any) => b.type === "text") as any)?.text ??
      "（沒接到回覆）";

    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "coach api error" },
      { status: 500 }
    );
  }
}
