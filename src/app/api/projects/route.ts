import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "projects");

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

export async function GET() {
  try {
    const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith(".json"));
    const projects = [];
    for (const file of files) {
      const filePath = path.join(PROJECTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      try {
        const project = JSON.parse(content);
        projects.push(project);
      } catch (e) {
        console.error("Error parsing project file:", file);
      }
    }
    projects.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to read projects:", error);
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const project = await req.json();
    if (!project || !project.id) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }
    const filePath = path.join(PROJECTS_DIR, `${project.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save project:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "No project ID provided" }, { status: 400 });
    }
    const filePath = path.join(PROJECTS_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
