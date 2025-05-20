"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // ✅ Import toast

// 🧩 Définir Task
type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "faible" | "moyenne" | "haute";
  status?: "à faire" | "en cours" | "terminé";
  done: boolean;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [tags, setTags] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [taskInEdit, setTaskInEdit] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("dueDate");

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(data);
      } else {
        setError(data.error || "Erreur de chargement.");
      }
    };

    fetchTasks();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTask,
        description,
        dueDate,
        priority,
        status,
        tags: tags.split(",").map((tag) => tag.trim()), // convertit en tableau
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setTasks((prev) => [...prev, data]);
      setNewTask("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setStatus("todo");
      setTags("");
      setShowForm(false);
      toast.success("Tâche ajoutée !");
    } else {
      toast.error(data.error || "Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/tasks?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Tâche supprimée.");
    } else {
      const data = await res.json();
      toast.error(data.error || "Erreur lors de la suppression.");
    }
  };

  const toggleDone = async (id: string, current: boolean) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, done: !current }),
    });

    const updated = await res.json();
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: updated.done } : t))
      );
    }
  };

  const handleEdit = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, title: newTitle }),
    });

    const updated = await res.json();
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: updated.title } : t))
      );
      setTaskInEdit(null);
      setNewTitle("");
    }
  };

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === "dueDate") {
      return (
        new Date(a.dueDate || "").getTime() -
        new Date(b.dueDate || "").getTime()
      );
    }
    if (sortOption === "priority") {
      const order = { haute: 0, moyenne: 1, faible: 2 };
      return order[a.priority || "moyenne"] - order[b.priority || "moyenne"];
    }
    if (sortOption === "status") {
      const order = { "à faire": 0, "en cours": 1, terminé: 2 };
      return order[a.status || "à faire"] - order[b.status || "à faire"];
    }
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "done") {
      return Number(a.done) - Number(b.done);
    }
    return 0;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-800 via-blue-900 to-black px-4 py-6">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        >
          Déconnexion
        </button>
      </div>

      <h1 className="text-5xl font-bold text-center text-white mb-8 mt-10">
        Mes tâches
      </h1>

      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/85 z-10"
            onClick={() => {
              setShowForm(false);
              setEditTask(null);
            }}
          ></div>

          {/* Formulaire modale */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");

              const method = editTask ? "PATCH" : "POST";
              const body = {
                ...(editTask ? { id: editTask.id } : {}),
                title: newTask,
                description,
                dueDate,
                priority,
                status,
                tags: tags.split(",").map((tag) => tag.trim()),
              };

              fetch("/api/tasks", {
                method,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (!data.error) {
                    if (editTask) {
                      setTasks((prev) =>
                        prev.map((t) => (t.id === data.id ? data : t))
                      );
                      toast.success("Tâche modifiée !");
                    } else {
                      setTasks((prev) => [...prev, data]);
                      toast.success("Tâche ajoutée !");
                    }

                    setNewTask("");
                    setDescription("");
                    setDueDate("");
                    setPriority("moyenne");
                    setStatus("à faire");
                    setTags("");
                    setShowForm(false);
                    setEditTask(null);
                  } else {
                    toast.error(data.error);
                  }
                });
            }}
            className="relative z-20 space-y-3 mb-6 bg-slate-800 p-4 pt-12 rounded shadow-md max-w-[50%] mx-auto"
          >
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditTask(null);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg cursor-pointer"
              title="Fermer"
            >
              ❌
            </button>

            <input
              type="text"
              placeholder="Titre"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="bg-slate-900 text-white border-none p-2 w-full rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-900 text-white border-none p-2 w-full rounded"
            />
            <label className="text-white font-medium block mt-2 mb-1">
              Date d’échéance:
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-slate-900 text-white border-none p-2 w-full rounded"
            />

            <label className="text-white font-medium block mt-2 mb-1">
              Priorité :
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-900 text-white border-none p-2 w-full rounded"
            >
              <option value="faible">Faible</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>

            <label className="text-white font-medium block mt-2 mb-1">
              Statut :
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-900 text-white border-none p-2 w-full rounded"
            >
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-green-700 transition-colors"
            >
              {editTask ? "Modifier la tâche" : "Ajouter la tâche"}
            </button>
          </form>
        </>
      )}

      <div className="max-w-[50%] mx-auto space-y-4 mt-25">
        {/* Sélecteur de tri */}
        <div className="mb-4 text-white">
          <label htmlFor="sort" className="mr-2">
            Trier par :
          </label>
          <select
            id="sort"
            className="bg-slate-900 text-white p-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="dueDate">Date d’échéance</option>
            <option value="priority">Priorité</option>
            <option value="status">Statut</option>
            <option value="title">Titre (A-Z)</option>
          </select>
        </div>
        <ul className="list-disc space-y-2">
          {sortedTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between">
              <div
                onClick={() => router.push(`/tasks/${task.id}`)}
                className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 px-4 py-4 rounded w-full cursor-pointer transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{task.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === "haute"
                          ? "bg-red-500 text-white"
                          : task.priority === "moyenne"
                          ? "bg-yellow-400 text-black"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === "terminé"
                          ? "bg-green-600 text-white"
                          : task.status === "en cours"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.dueDate && (
                    <div className="text-sm text-gray-400 sm:ml-auto sm:mr-4">
                      📅 {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTask(task);
                      setNewTask(task.title);
                      setDescription(task.description || "");
                      setDueDate(task.dueDate?.split("T")[0] || "");
                      setPriority(task.priority || "moyenne");
                      setStatus(task.status || "à faire");
                      setTags((task as any).tags?.join(", ") || "");
                      setShowForm(true);
                    }}
                    className="text-yellow-400 cursor-pointer"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            setShowForm(true);
            setEditTask(null);
            setNewTask("");
            setDescription("");
            setDueDate("");
            setPriority("moyenne");
            setStatus("à faire");
            setTags("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
}
