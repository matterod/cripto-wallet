// pages/LoginWeb3.tsx

import { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import api from "../api";

export default function LoginWeb3({ onLogin }: { onLogin: () => void }) {
  const { connectWallet } = useWeb3();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addrShown, setAddrShown] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setError("");
      setLoading(true);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // 🔹 Paso 1: conectar MetaMask y obtener signer + address
      const { address, signer } = await connectWallet(); // <-- Cambio aquí
      
      if (!address || !signer) { // <-- Cambio aquí
        throw new Error("No se pudo obtener dirección o signer");
      }
      setAddrShown(address);

      // 🔹 Paso 2: pedir nonce al backend
      const { data: nonceData } = await api.post("/auth/web3/nonce/", { address: address });

      // 🔹 Paso 3: firmar nonce usando Ethers (¡Esta es la clave!)
      // ethers sabe cómo hacer un 'personal_sign' correctamente
      const signature = await signer.signMessage(nonceData.nonce); // <-- GRAN CAMBIO AQUÍ

      // 🔹 Paso 4: enviar firma al backend y obtener tokens JWT
      const { data: tokens } = await api.post("/auth/web3/verify/", {
        address: address, // la misma dirección
        signature,
      });

      // 🔹 Paso 5: guardar tokens y entrar al Dashboard
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
      onLogin();

    } catch (err: any) {
      console.error(err);
      // Intentar leer el error del backend si existe
      const backendError = err.response?.data?.error;
      setError(backendError || "Error al iniciar sesión con MetaMask");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Entrar con MetaMask</h2>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[#8247e5] text-white font-medium hover:bg-[#6e3bd1] transition disabled:opacity-50"
        >
          {loading ? "Firmando..." : "🔗 Conectar Wallet"}
        </button>

        {addrShown && (
          <p className="mt-3 text-xs break-all text-zinc-600 dark:text-zinc-400">
            {addrShown}
          </p>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}