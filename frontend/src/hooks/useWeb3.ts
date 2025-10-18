// hooks/useWeb3.ts

import { useState } from "react";
import { ethers } from "ethers";

export function useWeb3() {
  const [address, setAddress] = useState<string | null>(null);
  
  // No necesitamos el signer en el estado, solo devolverlo
  // No necesitamos el balance para el login

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Instalá MetaMask");
      return { address: null, signer: null }; // Devolver un objeto
    }

    // 1. Crear el provider de ethers
    const provider = new ethers.BrowserProvider(window.ethereum);

    // 2. Pedir cuentas (esto también hace que el provider sepa quién es el signer)
    await provider.send("eth_requestAccounts", []);
    
    // 3. Obtener el objeto "signer" (el que puede firmar)
    const signer = await provider.getSigner();

    // 4. Obtener la dirección desde el signer
    const addr = (await signer.getAddress()).toLowerCase();
    
    setAddress(addr);

    // 5. Devolver ambos
    return { address: addr, signer: signer };
  }

  return { address, connectWallet };
}