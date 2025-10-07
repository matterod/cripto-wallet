from decimal import Decimal
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Case, When, Value, F, DecimalField
from .models import Coin, Transaction
from .serializers import CoinSerializer, TransactionSerializer
from .services.prices import get_prices_usd


class CoinList(generics.ListAPIView):
    """
    Público: listado de monedas disponibles.
    """
    queryset = Coin.objects.all().order_by("id")
    serializer_class = CoinSerializer
    permission_classes = [permissions.AllowAny]  # público por decisión de negocio


class TransactionListCreate(generics.ListCreateAPIView):
    """
    Protegido (JWT): lista y crea transacciones del usuario autenticado.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Transaction.objects
            .filter(user=self.request.user)
            .select_related("coin")  # micro-optimización si el serializer usa coin
            .order_by("-ts")
        )

    def perform_create(self, serializer):
        # fuerza el user autenticado, ignorando cualquier 'user' enviado por el cliente
        serializer.save(user=self.request.user)


class Balances(APIView):
    """
    Protegido (JWT): devuelve balances por ticker + valuación en USD.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = (
            Transaction.objects
            .filter(user=request.user)
            .values("coin__ticker")
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
            .order_by("coin__ticker")
        )

        rows = [row for row in qs if row["balance"] is not None]
        tickers = [row["coin__ticker"] for row in rows]

        # fallback si no hay transacciones
        default_universe = ["BTC", "ETH", "USDT"]

        try:
            prices = get_prices_usd(tickers if tickers else default_universe) or {}
        except Exception:
            # si el proveedor de precios falla, continuamos con precios 0
            prices = {}

        data = []
        total_usd = Decimal("0")
        for row in rows:
            tkr = row["coin__ticker"]
            bal_dec = row["balance"] or Decimal("0")
            price = Decimal(str(prices.get(tkr, 0)))  # robusto ante float o str
            value = (bal_dec * price).quantize(Decimal("0.01"))  # 2 decimales

            total_usd += value
            data.append({
                "coin": tkr,
                "balance": str(bal_dec),      # no perder precisión al serializar
                "price_usd": float(price),    # práctico para frontend
                "value_usd": float(value),
            })

        if data:
            data.append({"total_usd": float(total_usd)})

        return Response(data)
