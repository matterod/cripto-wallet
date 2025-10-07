# 💰 CRIPTO WALLET DASHBOARD

## ¿Qué es Cripto Wallet?

Cripto Wallet es una aplicación full-stack moderna que permite registrar, visualizar y analizar transacciones de criptomonedas en tiempo real. Está desarrollada con Django Rest Framework, React + TypeScript, Redis y PostgreSQL, integrando backend, frontend y servicios con Docker Compose.

Su objetivo es simular una billetera digital de inversión, similar a la interfaz de exchanges como Ripio, Binance o Coinbase, con métricas financieras y visualizaciones dinámicas.

## 🚀 FUNCIONALIDADES PRINCIPALES

- ✅ **Autenticación JWT** — Inicio de sesión y validación de usuarios con tokens.
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

Para crear el user y su Password:

```bash
docker compose exec backend python manage.py createsuperuser
```
Te va a pedir:

```bash
Username: admin
Email address: admin@example.com
Password: ******
Password (again): ******
```

Completas los datos e Inicias con eso.

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

- 🖥️ **Backend:** Django 5 + Django Rest Framework
- 🔒 **Autenticación:** JWT (SimpleJWT)
- 🗄️ **Base de datos:** PostgreSQL
- ⚙️ **Cache / Cola:** Redis
- 💡 **Frontend:** React + TypeScript + Vite
- 🎨 **Estilos:** Tailwind + CSS modular
- 🐳 **Infraestructura:** Docker Compose
- 🧪 **Testing:** Pytest + Django TestCase

## 📊 DASHBOARD PRINCIPAL

El dashboard muestra información de forma visual e interactiva:

- 📈 **Evolución del capital invertido en el tiempo**
- 💹 **Composición del portafolio por moneda**
- 💵 **Registro cronológico de todas las transacciones**
- 💰 **Cálculo del valor total en USD**

<img width="488" height="891" alt="Screenshot from 2025-10-06 21-21-20" src="https://github.com/user-attachments/assets/8f471355-651d-4a0f-bbfd-c6a11a3f8e54" />

## 🧑‍💼 AUTOR

**Matteo Rodríguez**

- 💼 Desarrollador Full Stack / IoT / Networking
- 📧 rodrigmatteo@gmail.com
- 🌐 [github.com/matterod](https://github.com/matterod)
