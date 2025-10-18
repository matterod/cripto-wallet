// App.tsx
import { useState } from "react";
import Login from "./pages/Login";
import LoginWeb3 from "./pages/LoginWeb3";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("access"));
  const [mode, setMode] = useState<"classic" | "web3" | null>(null);

  if (authed) return <Dashboard />;

  if (mode === "classic") return <Login onLogin={() => setAuthed(true)} />;
  if (mode === "web3") return <LoginWeb3 onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">Cripto Wallet</h1>
        <button
          onClick={() => setMode("classic")}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Iniciar sesión con Usuario
        </button>
        <button
          onClick={() => setMode("web3")}
          className="px-4 py-2 rounded-xl bg-[#8247e5] text-white"
        >
          Entrar con MetaMask
        </button>
      </div>
    </div>
  );
}
