"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } else {
      toast.error(data.error || "Identifiants incorrects");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* 🎬 Vidéo de fond */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-10]"
      >
        <source src="/video/task.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* 🌓 Filtre sombre */}
      <div className="absolute inset-0 bg-black opacity-75 z-[-5]" />

      {/* 🧩 Contenu par-dessus */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">
          Bienvenue sur <span className="text-blue-400">TaskBoard</span>
        </h1>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white bg-opacity-90 p-6 shadow-lg rounded space-y-4 text-black"
        >
          <h2 className="text-xl font-bold text-center">Connexion</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Se connecter
          </button>

          <p className="text-sm text-center text-gray-700">
            {`Vous n'avez pas de compte ? `}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Inscrivez-vous
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
