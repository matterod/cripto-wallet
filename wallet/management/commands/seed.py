# management/commands/seed.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from wallet.models import Coin, Transaction
from decimal import Decimal

class Command(BaseCommand):
    help = "Carga monedas y datos de ejemplo (usuario demo + transacciones)"

    def add_arguments(self, parser):
        parser.add_argument("--purge", action="store_true", help="Borra datos previos")

    def handle(self, *args, **opts):
        if opts["purge"]:
            Transaction.objects.all().delete()
            Coin.objects.all().delete()
            self.stdout.write(self.style.WARNING("Datos anteriores purgados."))

        # Usuario demo
        user, _ = User.objects.get_or_create(username="demo")
        if not user.has_usable_password():
            user.set_password("demo1234")
            user.save()

        # Monedas
        btc, _ = Coin.objects.get_or_create(ticker="BTC", defaults={"name": "Bitcoin"})
        eth, _ = Coin.objects.get_or_create(ticker="ETH", defaults={"name": "Ethereum"})
        usdt, _ = Coin.objects.get_or_create(ticker="USDT", defaults={"name": "Tether"})

        # Transacciones ejemplo (BUY suma, SELL resta)
        sample = [
            (btc, "BUY",  "0.01000000", "60000"),
            (btc, "SELL", "0.00500000", "125000"),
            (eth, "BUY",  "12.00000000", "2000"),
        ]
        for coin, typ, amount, price in sample:
            Transaction.objects.get_or_create(
                user=user, coin=coin, type=typ,
                amount=Decimal(amount), price_usd=Decimal(price)
            )

        self.stdout.write(self.style.SUCCESS("Seed OK. Usuario: demo / demo1234"))
