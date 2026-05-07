import { NextRequest, NextResponse } from "next/server";
import { generateForDay, getWeeklyPlan } from "@/lib/restart-fit/programming";
import { nutritionFromPreference } from "@/lib/restart-fit/nutrition";
import type { UserTrainingPreference } from "@/lib/restart-fit/types";

// POST /api/restart-fit/plan
// body: { user: UserTrainingPreference, day_index?: number, body?: { height_cm?, age?, sex? } }
export async function POST(req: NextRequest) {
  try {
    const { user, day_index, body } = (await req.json()) as {
      user: UserTrainingPreference;
      day_index?: number;
      body?: { height_cm?: number; age?: number; sex?: "male" | "female" | "other" };
    };

    if (!user || !user.goal) {
      return NextResponse.json({ error: "user preference required" }, { status: 400 });
    }

    const workout = generateForDay({ user, day_index });
    const weeklyPlan = getWeeklyPlan(user.weekly_sessions).map((t) => ({
      id: t.id,
      name: t.name,
      day_index: t.day_index,
      description: t.description,
    }));

    let nutrition = null;
    if (user.body_weight_kg) {
      nutrition = nutritionFromPreference({
        weight_kg: user.body_weight_kg,
        target_weight_kg: user.target_weight_kg,
        height_cm: body?.height_cm,
        age: body?.age,
        sex: body?.sex,
        weekly_sessions: user.weekly_sessions,
        diet_goal: user.diet_goal,
      });
    }

    return NextResponse.json({ workout, weekly_plan: weeklyPlan, nutrition });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "plan error" }, { status: 500 });
  }
}
