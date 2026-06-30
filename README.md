# CV App

A personal CV/resume site: React (Vite) frontend, Express + SQLite backend, fully Dockerized, deployed via GitHub Actions to a self-hosted runner using Docker Compose.

## Stack

- **Frontend**: React + Vite, served by nginx in production, nginx proxies `/api/*` to the backend container.
- **Backend**: Node.js + Express + `better-sqlite3`, exposes `/api/profile`, `/api/experience`, `/api/projects`, `/api/skills`, and `/api/cv` (aggregate).
- **Database**: SQLite file persisted in a Docker volume (`cv-data`).
- **CI/CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) that runs on a **self-hosted runner**, rebuilds images, and restarts via `docker compose`.

## Local development

Backend:
```bash
cd backend
npm install
npm run seed   # populate sample data
npm start      # http://localhost:4000
```

Frontend:
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173, talks to http://localhost:4000 by default
```

To point the dev frontend at a different backend URL, set `VITE_API_URL` in a `.env` file inside `frontend/`.

## Editing your CV content

Edit `backend/src/seed.js` with your real name, experience, projects, and skills, then run `npm run seed` (locally) or just redeploy (the Docker entrypoint reseeds on every container start, upserting the profile and replacing experience/projects/skills).

If you'd rather data persist independently of the seed file (e.g. edit live without redeploying), remove the seed call from the backend Dockerfile's `CMD` after the first deploy, or add admin endpoints — the schema already supports it.

## Running with Docker Compose

```bash
docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend (internal only, reached via the frontend's `/api` proxy): port 4000 inside the Docker network

## Setting up the self-hosted runner

1. On your host machine, install Docker and the Docker Compose plugin.
2. In your GitHub repo: **Settings → Actions → Runners → New self-hosted runner**, follow the install/configure steps for your OS.
3. Make sure the runner's user can run `docker` (add it to the `docker` group, or otherwise ensure the daemon is reachable).
4. Push to `main` — the `Deploy CV App` workflow checks out the repo on that machine, runs `docker compose build` and `docker compose up -d`, then verifies the site responds before finishing.

## Repo layout

```
cv-app/
├── backend/        # Express + SQLite API
├── frontend/        # React (Vite) app, builds to static files served by nginx
├── docker-compose.yml
└── .github/workflows/deploy.yml
```
