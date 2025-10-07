from rest_framework import serializers
from .models import Coin, Transaction

class CoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coin
        fields = ["id", "ticker", "name"]

class TransactionSerializer(serializers.ModelSerializer):
    # opcional: mostrar info legible
    coin_ticker = serializers.CharField(source="coin.ticker", read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "coin", "coin_ticker", "type", "amount", "price_usd", "ts"]
        read_only_fields = ["ts"]
