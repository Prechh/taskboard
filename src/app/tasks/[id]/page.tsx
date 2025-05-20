import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function TaskDetailsPage({ params }: Props) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
  });

  if (!task) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-900 to-black px-4 py-8">
      <div className="w-full max-w-xl space-y-4">
        <div className="bg-gray-900 text-white p-6 rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>

          <p className="mb-2">
            <span className="font-semibold">Description :</span>{" "}
            {task.description || "—"}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Échéance :</span>{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("fr-FR")
              : "—"}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Priorité :</span> {task.priority}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Statut :</span> {task.status}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded transition-colors"
        >
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
