from django.db import models
from django.contrib.auth.models import User

class Coin(models.Model):
    ticker = models.CharField(max_length=10, unique=True)   # BTC, ETH, USDT
    name   = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.ticker} - {self.name}"

class Transaction(models.Model):
    TYPE = (("BUY","BUY"), ("SELL","SELL"), ("TRANSFER","TRANSFER"))

    user      = models.ForeignKey(User, on_delete=models.CASCADE)
    coin      = models.ForeignKey(Coin, on_delete=models.PROTECT)
    type      = models.CharField(choices=TYPE, max_length=10)
    amount    = models.DecimalField(max_digits=18, decimal_places=8)   # cantidad de cripto
    price_usd = models.DecimalField(max_digits=18, decimal_places=8)   # precio unitario USD
    ts        = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-ts"]

    def __str__(self):
        return f"{self.user.username} {self.type} {self.amount} {self.coin.ticker} @ {self.price_usd} USD"
