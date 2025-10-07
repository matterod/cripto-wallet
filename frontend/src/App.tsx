import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("access"));
  return authed ? <Dashboard /> : <Login onLogin={() => setAuthed(true)} />;
}
