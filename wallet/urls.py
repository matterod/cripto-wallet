from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CoinList, TransactionListCreate, Balances
from . import views, views_web3
urlpatterns = [
    # auth JWT
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/web3/nonce/", views_web3.web3_nonce),
    path("auth/web3/verify/", views_web3.web3_verify),
    # endpoints
    path("coins/", CoinList.as_view(), name="coins"),                      # público
    path("transactions/", TransactionListCreate.as_view(), name="transactions"),  # JWT
    path("balances/", Balances.as_view(), name="balances"),                # JWT
]
