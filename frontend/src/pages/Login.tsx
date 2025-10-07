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
    } catch (err: any) {
      setError("Usuario o contraseña inválidos");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "system-ui" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={submit}>
        <div>
          <label>Usuario</label>
          <input value={username} onChange={(e)=>setU(e.target.value)} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e)=>setP(e.target.value)} />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{color:"crimson"}}>{error}</p>}
    </div>
  );
}
