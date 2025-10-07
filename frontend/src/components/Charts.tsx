import { PieChart, Pie, Tooltip as PieTooltip, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type BalanceItem = { coin?: string; balance?: string; price_usd?: number; value_usd?: number; total_usd?: number };
type Tx = { id:number; type:"BUY"|"SELL"|"TRANSFER"; amount:string; price_usd:string; ts?:string; coin:number; coin_ticker?:string };

export function PortfolioPie({ balances }: { balances: BalanceItem[] }) {
  const items = balances.filter(b => b.coin && (b.value_usd ?? 0) > 0) as BalanceItem[];
  const data = items.map(b => ({ name: b.coin!, value: Number(b.value_usd || 0) }));
  if (!data.length) return <p style={{opacity:.7}}>Sin valores para graficar.</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie dataKey="value" data={data} outerRadius={110} label />
        <PieTooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InvestedLine({ txs }: { txs: Tx[] }) {
  // Serie temporal de inversión neta acumulada (BUY suma, SELL resta)
  const sorted = [...txs].sort((a,b)=> (new Date(a.ts||0).getTime()) - (new Date(b.ts||0).getTime()));
  let acc = 0;
  const series = sorted.map(t => {
    const delta = (t.type === "BUY" ? 1 : t.type === "SELL" ? -1 : 0) * (Number(t.amount) * Number(t.price_usd));
    acc += delta;
    return { date: new Date(t.ts || Date.now()).toLocaleDateString(), invested_usd: Math.round(acc * 100)/100 };
  });

  if (!series.length) return <p style={{opacity:.7}}>Aún no hay transacciones.</p>;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={series} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="invested_usd" />
      </LineChart>
    </ResponsiveContainer>
  );
}
