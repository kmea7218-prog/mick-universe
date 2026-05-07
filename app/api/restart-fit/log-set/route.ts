import { NextRequest, NextResponse } from "next/server";
import { suggestNextSession } from "@/lib/restart-fit/progression";
import { EXERCISE_LIBRARY } from "@/lib/restart-fit/exercises";
import type { WorkoutSetLog } from "@/lib/restart-fit/types";

// POST /api/restart-fit/log-set
// Stateless — caller passes in this session's sets + (optional) recent history.
// We compute next-time recommendation but DO NOT persist (persistence layer = Supabase, future).
//
// body: {
//   exercise_id: string,
//   sets_this_session: WorkoutSetLog[],
//   recent_history?: { [dateISO]: WorkoutSetLog[] }
// }
export async function POST(req: NextRequest) {
  try {
    const { exercise_id, sets_this_session, recent_history } = (await req.json()) as {
      exercise_id: string;
      sets_this_session: WorkoutSetLog[];
      recent_history?: Record<string, WorkoutSetLog[]>;
    };

    const ex = EXERCISE_LIBRARY.find((e) => e.id === exercise_id);
    if (!ex) {
      return NextResponse.json({ error: "unknown exercise_id" }, { status: 400 });
    }

    const suggestion = suggestNextSession(ex, sets_this_session || [], recent_history);
    return NextResponse.json({
      exercise: { id: ex.id, name_zh: ex.name_zh, default_rep_range: ex.default_rep_range },
      suggestion,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "log-set error" }, { status: 500 });
  }
}
