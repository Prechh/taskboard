"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-800 via-pink-800 to-red-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 z-0" />

      <main className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={handleLogin}
          className="bg-white text-black p-6 shadow-xl rounded space-y-4"
        >
          <h1 className="text-xl font-bold text-center">Connexion</h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Se connecter
          </button>

          <p className="text-sm text-center text-gray-700">
            {`Vous n'avez pas encore de compte ? `}
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
