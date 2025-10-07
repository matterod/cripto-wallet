export type Coin = { id: number; ticker: string; name: string };
export type Transaction = {
  id: number;
  coin: number;
  coin_ticker?: string;
  type: "BUY" | "SELL" | "TRANSFER";
  amount: string;
  price_usd: string;
  ts?: string;
};
