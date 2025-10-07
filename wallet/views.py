from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Case, When, Value, F, DecimalField  
from .models import Coin, Transaction
from .serializers import CoinSerializer, TransactionSerializer
from .services.prices import get_prices_usd  

class CoinList(generics.ListAPIView):
    queryset = Coin.objects.all().order_by("id")
    serializer_class = CoinSerializer
    permission_classes = [permissions.AllowAny]  # público

class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by("-ts")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class Balances(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = (
            Transaction.objects
            .filter(user=request.user)
            .values('coin__ticker')
            .annotate(
                balance=Sum(
                    Case(
                        When(type="BUY",  then=F("amount")),
                        When(type="SELL", then=-F("amount")),
                        default=Value(0),
                        output_field=DecimalField(max_digits=18, decimal_places=8),
                    )
                )
            )
            .order_by('coin__ticker')
        )

        rows = [row for row in qs if row["balance"] is not None]
        tickers = [row["coin__ticker"] for row in rows]
        prices = get_prices_usd(tickers or ["BTC","ETH","USDT"])  # fallback

        data = []
        total_usd = 0.0
        for row in rows:
            tkr = row["coin__ticker"]
            bal = float(row["balance"] or 0)
            p = float(prices.get(tkr, 0.0))
            v = bal * p
            total_usd += v
            data.append({
                "coin": tkr,
                "balance": f"{row['balance']}",  # string para no perder decimales
                "price_usd": p,
                "value_usd": round(v, 2),
            })

        # opcional: sumar un objeto final con el total
        if data:
            data.append({"total_usd": round(total_usd, 2)})

        return Response(data)