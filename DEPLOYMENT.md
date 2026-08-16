# Deployment Guide — Servixa

This guide covers local Docker testing, environment configuration, and production deployment options.

## Quick Start (Local Docker)

Run the entire stack locally with Docker Compose:

```bash
# Copy .env.local.example to .env (if exists)
cp frontend/.env.local.example .env.local

# Start all services
docker compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8000/health
# Database: postgres://bestbuild:dev-password@localhost:5432/bestbuild_db
# Redis: localhost:6379
```

To stop:
```bash
docker compose down
docker compose down -v  # with volume cleanup
```

---

## Environment Variables

### Backend (`backend/app/shared/config.py`)

| Variable | Type | Default | Notes |
|----------|------|---------|-------|
| `CORS_ORIGINS` | string (CSV) | `http://localhost:3000` | Comma-separated allowed origins, e.g., `https://yourdomain.com,https://api.yourdomain.com` |
| `JWT_SECRET` | string | `dev-secret-change-me` | **CHANGE IN PRODUCTION**. Use a strong random string (min 32 chars). |
| `JWT_ALGORITHM` | string | `HS256` | Token signing algorithm (internal, not configurable yet). |

### Frontend (`.env.local` / `next.config.ts`)

| Variable | Type | Default | Notes |
|----------|------|---------|-------|
| `NEXT_PUBLIC_API_URL` | string | (inferred) | Backend API endpoint, e.g., `https://api.yourdomain.com`. Used by browser to call the backend. |

### Optional (for AI features and production DB)

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| `DATABASE_URL` | string | `postgresql://user:pass@host:5432/db` | PostgreSQL or TiDB connection. Required for migration to DB-backed backend. |
| `REDIS_URL` | string | `redis://localhost:6379` | Redis connection for async jobs, caching. |
| `OPENAI_API_KEY` | string | `sk-...` | OpenAI API key for LLM features. |
| `ANTHROPIC_API_KEY` | string | `sk-ant-...` | Anthropic API key (alternative to OpenAI). |
| `AZURE_OPENAI_KEY` | string | (key) | Azure OpenAI API key. |
| `AZURE_OPENAI_ENDPOINT` | string | `https://xxx.openai.azure.com/` | Azure OpenAI endpoint. |

---

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel)**
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set environment variables in Project Settings:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com`
4. Vercel auto-deploys on push to `main`
5. Add custom domain in Vercel dashboard

**Backend (Render)**
1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repo, select `backend` start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
3. Add environment variables:
   - `CORS_ORIGINS` = `https://yourdomain.com`
   - `JWT_SECRET` = (set a strong secret)
   - Database: Provision PostgreSQL on Render, copy `DATABASE_URL`
   - Redis: Provision Redis on Render, copy `REDIS_URL`
4. Add custom domain to Render service
5. Render auto-deploys on push to `main`

### Option 2: Fly.io (Frontend + Backend)

**Both apps on Fly.io**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth login`
3. Create apps:
   ```bash
   cd frontend
   flyctl launch  # Creates fly.toml
   flyctl deploy
   
   cd ../backend
   flyctl launch  # Creates fly.toml
   flyctl deploy
   ```
4. Set secrets:
   ```bash
   flyctl secrets set JWT_SECRET="your-secret-here"
   flyctl secrets set CORS_ORIGINS="https://yourdomain.com"
   ```
5. Provision PostgreSQL and Redis via Fly Postgres / Redis add-ons
6. Redeploy: `flyctl deploy`

### Option 3: Railway (Full Stack)

1. Sign up at [Railway](https://railway.app)
2. Create a new project, connect GitHub repo
3. Add services:
   - Postgres (auto-provision)
   - Redis (auto-provision)
   - Backend (run `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`)
   - Frontend (run `pnpm build && pnpm start`)
4. Set environment variables in Railway dashboard
5. Point domain via CNAME to Railway's provided URL

### Option 4: Docker + Self-Hosted / AWS ECS / GKE

**Build and push Docker image**
```bash
# Build backend
docker build -t bestbuild-backend:latest ./backend

# Push to registry (Docker Hub, ECR, GCR, etc.)
docker tag bestbuild-backend:latest myregistry/bestbuild-backend:latest
docker push myregistry/bestbuild-backend:latest
```

**Deploy with Kubernetes / Docker Swarm / ECS**
- Use the provided `Dockerfile` and `docker-compose.yml` as templates
- Ensure environment variables are injected via secrets manager
- Use a reverse proxy (nginx, Caddy) for SSL termination
- Configure health checks to point to `/health` endpoint

---

## Production Checklist

Before going live:

- [ ] Set strong `JWT_SECRET` (min 32 random chars)
- [ ] Update `CORS_ORIGINS` to production domain(s)
- [ ] Set `NEXT_PUBLIC_API_URL` in frontend to production API endpoint
- [ ] Provision production database (TiDB, PostgreSQL, managed service)
- [ ] Provision production Redis (if using background jobs)
- [ ] Set LLM API keys (OpenAI, Anthropic, Azure, etc.)
- [ ] Enable HTTPS/SSL on backend and frontend
- [ ] Set up monitoring (OpenTelemetry, Sentry, Langfuse)
- [ ] Configure backups for database
- [ ] Test health checks: `GET /health` should return `{"status": "ok"}`
- [ ] Load test to ensure API performance
- [ ] Set up CI/CD (GitHub Actions workflow provided in `.github/workflows/deploy.yml`)
- [ ] Document any custom env vars or secrets

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Backend**:
   - Install dependencies with `uv sync`
   - Run tests (currently placeholder)
   - Build Docker image
   - Push to container registry

2. **Frontend**:
   - Install dependencies with `pnpm`
   - Run linting
   - Build Next.js
   - Deploy to Vercel (if `VERCEL_TOKEN` secret is set)

3. **Deployment**:
   - Trigger Render deploy hook (if `RENDER_DEPLOY_HOOK` secret is set)
   - Can also deploy to Fly.io with `FLY_API_TOKEN`

To enable, add GitHub Secrets in your repo:
- `VERCEL_TOKEN` (for Vercel frontend deployment)
- `RENDER_DEPLOY_HOOK` (for Render backend deployment)
- `FLY_API_TOKEN` (alternative: for Fly.io deployment)

---

## Database Migration (Optional)

Currently, the backend runs without a persistent database. To add PostgreSQL or TiDB:

1. Create `backend/models.py` with SQLAlchemy ORM models
2. Install database driver: `uv add sqlalchemy psycopg[binary]` (Postgres) or `uv add sqlalchemy pymysql` (TiDB)
3. Update `backend/app/main.py` to connect to database
4. Create migrations with Alembic: `alembic init alembic && alembic upgrade head`
5. Update backend startup to run migrations before server starts

Example migration trigger in `main.py`:
```python
from alembic.config import Config
from alembic.script import ScriptDirectory
from alembic.runtime.migration import MigrationContext
from alembic.operations import Operations

# Run migrations on startup
alembic_cfg = Config("alembic.ini")
with engine.begin() as connection:
    mc = MigrationContext.configure(connection)
    op = Operations(mc)
    # op.upgrade() — handled by Alembic CLI
```

---

## Local Testing with Docker Compose

```bash
# Full stack
docker compose up --build

# Scale backend (if needed)
docker compose up --scale backend=2

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild one service
docker compose build backend && docker compose up backend

# Clean up
docker compose down -v
```

---

## Troubleshooting

- **Frontend cannot reach backend**: Ensure `NEXT_PUBLIC_API_URL` is set and backend `CORS_ORIGINS` includes frontend URL.
- **Database connection fails**: Check `DATABASE_URL` format and ensure database service is running.
- **JWT errors**: Ensure `JWT_SECRET` is the same across all backend instances.
- **Port conflicts**: Change ports in `docker-compose.yml` or use `docker compose port service port`.

---

## Next Steps

1. Set up GitHub Actions secrets for deployment
2. Choose a hosting provider (Vercel/Render recommended)
3. Provision production database and Redis
4. Deploy frontend and backend
5. Point domain and test health endpoints
6. Monitor with Sentry, Langfuse, or similar

For questions, refer to:
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
