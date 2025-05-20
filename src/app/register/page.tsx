"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Compte créé avec succès !");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      toast.error(data.error || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 z-0" />

      <main className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={handleRegister}
          className="bg-white text-black p-6 shadow-xl rounded space-y-4"
        >
          <h1 className="text-xl font-bold text-center">Créer un compte</h1>

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

          <input
            type="password"
            placeholder="Confirme le mot de passe"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            S’inscrire
          </button>

          <p className="text-sm text-center text-gray-700">
            {`Vous avez déjà un compte ? `}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Connectez-vous
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
