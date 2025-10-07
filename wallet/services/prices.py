# wallet/services/prices.py
import json, requests, os
from typing import Dict
try:
    import redis
    r = redis.Redis(host=os.getenv("REDIS_HOST","127.0.0.1"), port=int(os.getenv("REDIS_PORT","6379")), db=0)
except Exception:
    r = None  # si no hay redis, seguimos sin cache

# mapeo simple coin→id de CoinGecko (podés guardarlo en DB luego)
COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "USDT": "tether",
}

def get_prices_usd(tickers=("BTC","ETH","USDT")) -> Dict[str, float]:
    # intento cache (60s)
    cache_key = "prices:v1"
    if r:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    ids = ",".join(COINGECKO_IDS[t] for t in tickers if t in COINGECKO_IDS)
    url = "https://api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params={"ids": ids, "vs_currencies": "usd"}, timeout=5)
    data = resp.json()  # {'bitcoin': {'usd': 60000}, ...}

    # convertir a dict por ticker {'BTC': 60000, ...}
    prices = {t: float(data.get(COINGECKO_IDS[t], {}).get("usd", 0.0)) for t in tickers}

    if r:
        r.setex(cache_key, 60, json.dumps(prices))
    return prices
