from django.contrib import admin
from .models import Coin, Transaction

@admin.register(Coin)
class CoinAdmin(admin.ModelAdmin):
    list_display = ("id", "ticker", "name")
    search_fields = ("ticker", "name")

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "coin", "type", "amount", "price_usd", "ts")
    list_filter  = ("type", "coin")
    search_fields = ("user__username",)
