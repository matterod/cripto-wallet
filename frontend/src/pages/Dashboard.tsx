// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "../api";
import type { Transaction, Coin } from "../types";
import { PortfolioPie, InvestedLine } from "../components/Charts";
import { DollarSign, Bitcoin, List } from "lucide-react";

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [form, setForm] = useState<Partial<Transaction>>({
    coin: undefined, type: "BUY", amount: "", price_usd: ""
  });
  const [loading, setLoading] = useState(true);
  const total = balances.find((b: any) => b.total_usd)?.total_usd || 0;

  async function load() {
    setLoading(true);
    try {
      const [coinsRes, txRes, balRes] = await Promise.all([
        api.get("/coins/"),
        api.get("/transactions/"),
        api.get("/balances/"),
      ]);
      setCoins(coinsRes.data);
      setTxs(txRes.data);
      setBalances(balRes.data);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">Crypto Wallet</h2>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Kpi title="Valor total" value={`$ ${total.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} loading={loading} />
          <Kpi title="Monedas" value={balances.filter((b:any)=>b.coin).length} icon={<Bitcoin className="w-5 h-5" />} loading={loading} />
          <Kpi title="Transacciones" value={txs.length} icon={<List className="w-5 h-5" />} loading={loading} />
        </div>

        {/* Balances list */}
        <section className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] bg-white dark:bg-zinc-900 p-5">
          <h3 className="font-semibold mb-3">Balances</h3>
          {loading ? (
            <p className="text-zinc-500">Cargando…</p>
          ) : (
            <ul className="space-y-1">
              {balances.map((b: any, i) =>
                b.coin ? (
                  <li key={i} className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 py-2">
                    <span className="font-medium">{b.coin}</span>
                    <span className="text-right text-sm">
                      {b.balance} — ${b.value_usd} <span className="opacity-70">(price ${b.price_usd})</span>
                    </span>
                  </li>
                ) : (
                  <li key={i} className="pt-3 font-semibold">Total USD: ${b.total_usd}</li>
                )
              )}
              {!balances.length && <li className="text-zinc-500">Sin balances</li>}
            </ul>
          )}
        </section>

        {/* Charts */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card title="Composición del portfolio (USD)">
            <PortfolioPie balances={balances} />
          </Card>
          <Card title="Capital invertido en el tiempo">
            <InvestedLine txs={txs} />
          </Card>
        </section>

        {/* Form + Tabla */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-semibold mb-3">Crear transacción</h3>
            <form onSubmit={createTx} className="grid gap-3 max-w-md">
              <select
                className="rounded-xl border px-3 py-2 bg-transparent dark:border-zinc-700"
                value={form.coin ?? ""}
                onChange={(e)=>setForm(f=>({...f, coin: Number(e.target.value)||undefined}))}
                required
              >
                <option value="">Seleccionar coin</option>
                {coins.map(c => <option key={c.id} value={c.id}>{c.ticker} - {c.name}</option>)}
              </select>

              <select
                className="rounded-xl border px-3 py-2 bg-transparent dark:border-zinc-700"
                value={form.type}
                onChange={(e)=>setForm(f=>({...f, type: e.target.value as any}))}
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="TRANSFER">TRANSFER</option>
              </select>

              <input
                className="rounded-xl border px-3 py-2 bg-transparent dark:border-zinc-700"
                placeholder="Cantidad (amount)"
                value={form.amount || ""}
                onChange={(e)=>setForm(f=>({...f, amount: e.target.value}))}
                required
              />
              <input
                className="rounded-xl border px-3 py-2 bg-transparent dark:border-zinc-700"
                placeholder="Precio USD"
                value={form.price_usd || ""}
                onChange={(e)=>setForm(f=>({...f, price_usd: e.target.value}))}
                required
              />

              <button type="submit" className="px-3 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                Guardar
              </button>
            </form>
          </div>

          {/* Tabla */}
          <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] bg-white dark:bg-zinc-900 p-5 overflow-x-auto">
            <h3 className="font-semibold mb-3">Mis transacciones</h3>
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr className="text-left">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Coin</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Precio USD</th>
                </tr>
              </thead>
              <tbody>
                {txs.map(tx => (
                  <tr key={tx.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="p-3">{new Date(tx.ts || "").toLocaleString()}</td>
                    <td className="p-3">{tx.coin_ticker || tx.coin}</td>
                    <td className="p-3">{tx.type}</td>
                    <td className="p-3">{tx.amount}</td>
                    <td className="p-3">{tx.price_usd}</td>
                  </tr>
                ))}
                {!txs.length && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-500">Sin transacciones</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

/* --- mini componentes UI --- */
function Kpi({ title, value, icon, loading }: { title:string; value: string|number; icon?:React.ReactNode; loading?:boolean }) {
  return (
    <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">
            {loading ? <span className="animate-pulse text-zinc-400">···</span> : value}
          </p>
        </div>
        {icon && <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">{icon}</div>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.06)] bg-white dark:bg-zinc-900 p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
