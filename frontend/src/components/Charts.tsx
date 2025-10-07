import { PieChart, Pie, Tooltip as PieTooltip, Legend, Cell } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

type BalanceItem = { coin?: string; balance?: string; price_usd?: number; value_usd?: number; total_usd?: number };
type Tx = { id:number; type:"BUY"|"SELL"|"TRANSFER"; amount:string; price_usd:string; ts?:string; coin:number; coin_ticker?:string };

function formatUSD(n: number) {
  if (isNaN(n)) return "$0";
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n/1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function PortfolioPie({ balances }: { balances: BalanceItem[] }) {
  const items = balances.filter(b => b.coin && (b.value_usd ?? 0) > 0);
  const data = items.map(b => ({ name: b.coin!, value: Number(b.value_usd || 0) }));
  if (!data.length) return <p className="opacity-70">Sin valores para graficar.</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie dataKey="value" data={data} outerRadius={110} label={({name, value}) => `${name}: ${formatUSD(value)}`}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <PieTooltip formatter={(val: any) => formatUSD(Number(val))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InvestedLine({ txs }: { txs: Tx[] }) {
  const sorted = [...txs].sort((a,b)=> new Date(a.ts||0).getTime() - new Date(b.ts||0).getTime());
  let acc = 0;
  const series = sorted.map(t => {
    const delta = (t.type === "BUY" ? 1 : t.type === "SELL" ? -1 : 0) * (Number(t.amount) * Number(t.price_usd));
    acc += delta;
    return { date: new Date(t.ts || Date.now()).toLocaleDateString(), invested_usd: acc };
  });
  if (!series.length) return <p className="opacity-70">Aún no hay transacciones.</p>;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={series} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(v) => formatUSD(v)} />
        <Tooltip formatter={(v) => formatUSD(Number(v))} />
        <Line type="monotone" dataKey="invested_usd" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
