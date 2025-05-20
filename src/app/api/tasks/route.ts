import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader || "");

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader || "");

    const body = await req.json();
    const { title, description, dueDate, priority, status, tags } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status: status || "todo",
        tags: tags || [],
        userId: user.id,
      },
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json(
      { error: "Non autorisé ou erreur serveur" },
      { status: 401 }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader || "");
    const url = new URL(req.url);
    const taskId = url.searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader || "");
    const { id, title, description, dueDate, priority, status, tags } =
      await req.json();

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        priority: priority ?? task.priority,
        status: status ?? task.status,
        tags: tags ?? task.tags,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
