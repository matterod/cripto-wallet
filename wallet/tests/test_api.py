from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from wallet.models import Coin, Transaction
from decimal import Decimal

class ApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user("zen", password="mateR238579")
        self.client = APIClient()

        self.btc = Coin.objects.create(ticker="BTC", name="Bitcoin")
        self.eth = Coin.objects.create(ticker="ETH", name="Ethereum")

        # login para obtener token
        res = self.client.post("/api/auth/login/", {"username": "zen", "password": "mateR238579"}, format="json")
        self.assertEqual(res.status_code, 200)
        self.token = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_list_coins_public(self):
        c = APIClient()  # sin auth
        res = c.get("/api/coins/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(any(r["ticker"] == "BTC" for r in res.data))

    def test_create_tx_and_list(self):
        payload = {"coin": self.btc.id, "type": "BUY", "amount": "0.01000000", "price_usd": "60000"}
        res = self.client.post("/api/transactions/", payload, format="json")
        self.assertEqual(res.status_code, 201)

        res = self.client.get("/api/transactions/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["type"], "BUY")

    def test_balances_aggregation(self):
        Transaction.objects.create(user=self.user, coin=self.btc, type="BUY",
                                   amount=Decimal("0.01000000"), price_usd=Decimal("60000"))
        Transaction.objects.create(user=self.user, coin=self.btc, type="SELL",
                                   amount=Decimal("0.00500000"), price_usd=Decimal("120000"))
        res = self.client.get("/api/balances/")
        self.assertEqual(res.status_code, 200)
        btc_row = next(r for r in res.data if isinstance(r, dict) and r.get("coin") == "BTC")
        self.assertEqual(btc_row["balance"], "0.00500000")
