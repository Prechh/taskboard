import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const task = await prisma.task.findUnique({ where: { id: params.id } });

  return {
    title: task?.title || "Détail de la tâche",
  };
}

export default async function TaskDetailsPage({ params }: Props) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
  });

  if (!task) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-900 to-black text-white px-4">
      <div className="bg-gray-900 p-6 rounded shadow-md w-full max-w-xl space-y-2">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        <p>
          <span className="font-semibold">Description :</span>{" "}
          {task.description || "—"}
        </p>
        <p>
          <span className="font-semibold">Échéance :</span>{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("fr-FR")
            : "—"}
        </p>
        <p>
          <span className="font-semibold">Priorité :</span> {task.priority}
        </p>
        <p>
          <span className="font-semibold">Statut :</span> {task.status}
        </p>
        <a
          href="/dashboard"
          className="block mt-4 w-full text-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 rounded"
        >
          Retour au dashboard
        </a>
      </div>
    </div>
  );
}
