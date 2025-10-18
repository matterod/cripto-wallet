# 💰 CRIPTO WALLET DASHBOARD

## ¿Qué es Cripto Wallet?

Cripto Wallet es una aplicación full-stack moderna que permite registrar, visualizar y analizar transacciones de criptomonedas. Está desarrollada con Django Rest Framework, React + TypeScript, Redis y PostgreSQL, integrando backend, frontend y servicios con Docker Compose.

Su objetivo es simular una billetera digital de inversión, similar a la interfaz de exchanges como Ripio, Binance o Coinbase. 🦊 Ofrece un sistema de autenticación dual, permitiendo el registro clásico por usuario/contraseña (JWT) y una moderna autenticación descentralizada (Web3) a través de MetaMask.

## 🚀 FUNCIONALIDADES PRINCIPALES

- ✅ **Autenticación JWT** — Inicio de sesión clásico y validación de usuarios con tokens.
- ✅ **Autenticación Web3** — Inicio de sesión descentralizado usando firmas criptográficas de MetaMask (EIP-191).
- ✅ **API REST profesional** — Creada con Django Rest Framework.
- ✅ **Base de datos PostgreSQL** — Persistencia de usuarios, monedas y transacciones.
- ✅ **Sistema de balances automáticos** — Calcula valores y totales en USD.
- ✅ **Visualizaciones interactivas** — Gráficos en tiempo real con Chart.js.
- ✅ **Frontend en React + TypeScript** — Interfaz moderna y responsiva.
- ✅ **Cache con Redis** — Optimización de rendimiento.
- ✅ **Infraestructura con Docker Compose** — Despliegue instantáneo de todo el stack.

## 🧱 ARQUITECTURA GENERAL

```
cripto-wallet/
│
├── 🧩 cripto_wallet/       → Configuración Django (settings, urls, wsgi)
├── 💼 wallet/              → Modelos, vistas, serializadores y tests del backend
├── 🌐 frontend/            → Aplicación React + TypeScript + Vite
├── 🐳 docker-compose.yml   → Orquestación de backend, frontend, DB y Redis
├── ⚙️  Dockerfile.backend   → Imagen base del servidor Django
├── 🔐 backend.env          → Variables de entorno (DB, JWT, DEBUG, etc.)
├── 📄 requirements.txt      → Dependencias del backend
├── 🧪 pytest.ini           → Configuración de tests automáticos
└── 🧾 README.md            → Documentación del proyecto
```

## ⚙️ INSTALACIÓN Y EJECUCIÓN

### 🐳 OPCIÓN 1 — EJECUCIÓN CON DOCKER

#### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/matterod/cripto-wallet.git
cd cripto-wallet
```

#### 2️⃣ Levantar el entorno

```bash
docker compose up --build
```

✅ La aplicación levantará automáticamente:

- **Backend Django:** http://localhost:8000/admin
- **Frontend React:** http://localhost:5173
- **Base de datos PostgreSQL:** puerto 5432
- **Redis:** puerto 6379

#### 3️⃣ Opciones de Inicio de Sesión

El proyecto soporta dos métodos de autenticación:

##### Opción A: Login Web3 (Recomendado) 🦊

1. Abre el frontend: http://localhost:5173
2. Haz clic en "Entrar con MetaMask".
3. Conecta tu wallet y firma el mensaje.
4. ¡Listo! El sistema creará un usuario en el backend asociado automáticamente a tu dirección de wallet.

##### Opción B: Login Clásico (para Admin) 🔑

Si quieres probar el login clásico o acceder al panel de admin de Django (para agregar monedas manualmente, etc.):

1. Crea un superusuario en la terminal:

```bash
docker compose exec backend python manage.py createsuperuser
```

2. Te pedirá los datos:

```bash
Username: admin
Email address: admin@example.com
Password: ******
Password (again): ******
```

3. Inicia sesión con esas credenciales en el frontend (botón "Iniciar sesión con Usuario") o en el panel de admin de Django.

### 🧩 OPCIÓN 2 — DESARROLLO LOCAL (sin Docker)

#### Backend Django

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend React

```bash
cd frontend
npm install
npm run dev
```

## 🧪 TESTING

El backend cuenta con testeo automatizado mediante Pytest y Django TestCase.

Para ejecutarlos:

```bash
pytest
```

## 🧰 STACK TECNOLÓGICO

- 🖥️ **Backend:** Django 5 + Django Rest Framework + Web3.py
- 🔒 **Autenticación:** JWT (SimpleJWT) + Firmas Web3 (EIP-191)
- 🗄️ **Base de datos:** PostgreSQL
- ⚙️ **Cache / Cola:** Redis
- 💡 **Frontend:** React + TypeScript + Vite + Ethers.js
- 🎨 **Estilos:** Tailwind + CSS modular
- 🐳 **Infraestructura:** Docker Compose
- 🧪 **Testing:** Pytest + Django TestCase

## 📊 DASHBOARD PRINCIPAL

El dashboard muestra información de forma visual e interactiva:

- 📈 Evolución del capital invertido en el tiempo
- 💹 Composición del portafolio por moneda
- 💵 Registro cronológico de todas las transacciones
- 💰 Cálculo del valor total en USD

![Screenshot from 2025-10-06 21-21-20](https://github.com/user-attachments/assets/8f471355-651d-4a0f-bbfd-c6a11a3f8e54)

## 🧑‍💼 AUTOR

**Mateo Rodríguez**

- 💼 Desarrollador Full Stack / IoT / Networking
- 📧 rodrigmatteo@gmail.com
- 🌐 [github.com/matterod](https://github.com/matterod)