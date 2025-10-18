# /app/wallet/views_web3.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import secrets
from web3 import Web3
from eth_account.messages import encode_defunct # Importar para codificar el mensaje

# Obtener el modelo de User de Django
User = get_user_model()

# --- ATENCIÓN ---
# Este caché temporal funciona para desarrollo (1 solo proceso).
# Para producción, debes reemplazar esto por el caché de Django (con Redis o Memcached)
# para que funcione con múltiples workers.
nonces = {}  # cache temporal: {address: nonce}

# -----------------------------------------------------------------
# VISTA 1: Generar el Nonce
# -----------------------------------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def web3_nonce(request):
    """
    Genera un nonce aleatorio (mensaje) que el cliente firmará 
    con su wallet (ej. MetaMask).
    """
    address = request.data.get("address")
    if not address:
        return Response({"error": "Missing address"}, status=status.HTTP_400_BAD_REQUEST)

    # Genera un string hexadecimal aleatorio seguro
    nonce = secrets.token_hex(16)
    
    # Almacena el nonce asociado a la dirección del usuario (en minúsculas)
    # En un caso real, esto tendría un tiempo de expiración (ej. 5 minutos)
    nonces[address.lower()] = nonce
    
    # Devuelve el nonce al frontend
    return Response({"nonce": nonce})

# -----------------------------------------------------------------
# VISTA 2: Verificar la firma y Autenticar
# -----------------------------------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny]) # Permitir acceso ya que el usuario aún no está logueado
def web3_verify(request):
    """
    Verifica la firma del usuario (nonce firmado) y, si es válida,
    crea o loguea al usuario y devuelve tokens JWT.
    """
    address = request.data.get("address")
    signature = request.data.get("signature")

    if not address or not signature:
        return Response({"error": "Missing address or signature"}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Recuperar el nonce que enviamos originalmente
    nonce = nonces.get(address.lower())
    
    if not nonce:
        # El nonce no se encontró o ya fue usado
        return Response({"error": "Nonce not found or expired"}, status=status.HTTP_400_BAD_REQUEST)

    # Instanciar Web3 (no necesita proveedor para verificar firmas)
    w3 = Web3()
    
    try:
        # 2. Codificar el nonce (texto plano) al formato EIP-191.
        # Esto crea el mensaje exacto que MetaMask le pidió al usuario firmar.
        message = encode_defunct(text=nonce)

        # 3. Recuperar la dirección que firmó el mensaje
        recovered_address = w3.eth.account.recover_message(message, signature=signature)

    except Exception as e:
        # La firma podría estar mal formateada
        return Response({"error": f"Invalid signature format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    # 4. Comparar la dirección recuperada con la que envió el frontend
    if recovered_address.lower() != address.lower():
        return Response({"error": "Invalid signature. Address mismatch."}, status=status.HTTP_401_UNAUTHORIZED)

    # 5. ¡Éxito! La firma es válida.
    # Por seguridad, eliminamos el nonce para que no pueda ser reutilizado
    if address.lower() in nonces:
        del nonces[address.lower()]

    # 6. Autenticar al usuario: Buscar o crear
    # Usamos `username` como la wallet address (siempre en minúsculas)
    user, _ = User.objects.get_or_create(username=address.lower())

    # 7. Generar y devolver tokens JWT
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })