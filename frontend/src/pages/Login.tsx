// pages/Login.tsx
import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      onLogin();
    } catch {
      setError("Usuario o contraseña inválidos");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-500">Usuario</label>
            <input
              className="w-full mt-1 rounded-xl border px-3 py-2 bg-transparent outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
              value={username} onChange={(e)=>setU(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-zinc-500">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 rounded-xl border px-3 py-2 bg-transparent outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
              value={password} onChange={(e)=>setP(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black">
            Entrar
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
