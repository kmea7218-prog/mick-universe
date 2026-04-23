import { NextRequest, NextResponse } from "next/server";
import { analyzeBrainstorm } from "@/lib/claude";
import { fetchProjects, fetchTasks } from "@/lib/notion";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "idea is required" }, { status: 400 });
    }

    const [projects, tasks] = await Promise.all([fetchProjects(), fetchTasks()]);
    const analysis = await analyzeBrainstorm(idea, projects, tasks);
    return NextResponse.json({ analysis });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
