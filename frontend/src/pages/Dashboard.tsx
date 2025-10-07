import { useEffect, useState } from "react";
import api from "../api";
import type { Transaction, Coin } from "../types";
import { PortfolioPie, InvestedLine } from "../components/Charts";

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Partial<Transaction>>({
    coin: undefined, type: "BUY", amount: "", price_usd: ""
  });
  const [balances, setBalances] = useState<any[]>([]);

  async function load() {
    const [coinsRes, txRes, balRes] = await Promise.all([
      api.get("/coins/"),
      api.get("/transactions/"),
      api.get("/balances/"),
    ]);
    setCoins(coinsRes.data);
    setTxs(txRes.data);
    setBalances(balRes.data);
  }

  useEffect(() => { load(); }, []);

  async function createTx(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/transactions/", form);
    setForm({ coin: undefined, type: "BUY", amount: "", price_usd: "" });
    await load();
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    location.reload();
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Crypto Wallet</h2>
        <button onClick={logout}>Salir</button>
      </header>

      <section>
        <h3>Balances</h3>
        <ul>
          {balances.map((b: any, i) =>
            b.coin ? (
              <li key={i}>
                {b.coin}: {b.balance} — ${b.value_usd} (price ${b.price_usd})
              </li>
            ) : (
              <li key={i}><b>Total USD:</b> ${b.total_usd}</li>
            )
          )}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Crear transacción</h3>
        <form onSubmit={createTx} style={{ display:"grid", gap:8, maxWidth: 520 }}>
          <select
            value={form.coin ?? ""}
            onChange={(e)=>setForm(f=>({...f, coin: Number(e.target.value)||undefined}))}
            required
          >
            <option value="">Seleccionar coin</option>
            {coins.map(c => <option key={c.id} value={c.id}>{c.ticker} - {c.name}</option>)}
          </select>

          <select value={form.type} onChange={(e)=>setForm(f=>({...f, type: e.target.value as any}))}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="TRANSFER">TRANSFER</option>
          </select>

          <input
            placeholder="Cantidad (amount)"
            value={form.amount || ""}
            onChange={(e)=>setForm(f=>({...f, amount: e.target.value}))}
            required
          />
          <input
            placeholder="Precio USD"
            value={form.price_usd || ""}
            onChange={(e)=>setForm(f=>({...f, price_usd: e.target.value}))}
            required
          />
          <button type="submit">Guardar</button>
        </form>
      </section>
      <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 24, marginTop: 24 }}>
           <div>
                <h3>Composición del portfolio (USD)</h3>
                <PortfolioPie balances={balances} />
           </div>
           <div>
                <h3>Capital invertido en el tiempo</h3>
                <InvestedLine txs={txs} />
           </div>
         </section>
      <section style={{ marginTop: 24 }}>
        <h3>Mis transacciones</h3>
        <table width="100%" cellPadding={8} style={{ borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ textAlign:"left", borderBottom:"1px solid #ccc" }}>
              <th>Fecha</th><th>Coin</th><th>Tipo</th><th>Cantidad</th><th>Precio USD</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(tx => (
              <tr key={tx.id} style={{ borderBottom:"1px solid #eee" }}>
                <td>{new Date(tx.ts || "").toLocaleString()}</td>
                <td>{tx.coin_ticker || tx.coin}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.price_usd}</td>
              </tr>
            ))}
            {!txs.length && (
              <tr><td colSpan={5} style={{ opacity: .7 }}>Sin transacciones</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
