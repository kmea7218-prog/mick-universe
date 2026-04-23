import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/claude";
import { fetchProjects, fetchTasks } from "@/lib/notion";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Pull fresh context from Notion so Claude knows current state
    const [projects, tasks] = await Promise.all([fetchProjects(), fetchTasks()]);

    const reply = await chat(messages, projects, tasks);
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
