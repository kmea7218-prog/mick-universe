import { NextRequest, NextResponse } from "next/server";
import { EXERCISE_LIBRARY } from "@/lib/restart-fit/exercises";

// GET /api/restart-fit/exercises
// optional ?category=胸部&pattern=推&q=keyword
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const pat = searchParams.get("pattern");
  const q = searchParams.get("q")?.trim().toLowerCase();
  const equip = searchParams.getAll("equip");

  let list = EXERCISE_LIBRARY;
  if (cat) list = list.filter((e) => e.category === cat);
  if (pat) list = list.filter((e) => e.movement_pattern === pat);
  if (equip.length) list = list.filter((e) => e.equipment.some((eq) => equip.includes(eq)));
  if (q) {
    list = list.filter(
      (e) =>
        e.name_zh.includes(q) ||
        e.name_en.toLowerCase().includes(q) ||
        e.primary_muscles.some((m) => m.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ count: list.length, items: list });
}
