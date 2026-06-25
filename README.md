# Portfolio — Full Stack (Next.js + Node.js)

A full-stack professional portfolio application with a **Next.js frontend** and **Node.js/Express backend**, both deployable as separate **Azure Web App Services**.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Azure Cloud                      │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │  Frontend Web App    │  │  Backend Web App     │ │
│  │  (Next.js)           │──▶  (Node.js/Express)   │ │
│  │                      │  │                      │ │
│  │ next-frontend.       │  │ next-backend.        │ │
│  │ azurewebsites.net    │  │ azurewebsites.net    │ │
│  └──────────────────────┘  └──────────┬───────────┘ │
│                                       │              │
│                            ┌──────────▼───────────┐  │
│                            │  MongoDB Atlas       │  │
│                            │  (External Cloud DB) │  │
│                            └──────────────────────┘  │
│                                                     │
│                            ┌──────────────────────┐  │
│                            │  Cloudinary          │  │
│                            │  (Image/PDF storage) │  │
│                            └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- **Frontend** → calls Backend via `NEXT_PUBLIC_API_URL` environment variable
- **Backend** → connects to MongoDB Atlas and Cloudinary (no local file storage)
- **CORS** → Backend allows only the Frontend App's Azure URL

---

## Monorepo Structure

```
portfolio/
├── frontend/          # Next.js 15 app
│   ├── src/
│   ├── web.config     # Azure IIS/iisnode config
│   ├── next.config.ts
│   └── README.md      # Frontend deployment guide
│
├── backend/           # Node.js/Express API
│   ├── src/
│   ├── web.config     # Azure IIS/iisnode config
│   ├── package.json
│   └── README.md      # Backend deployment guide
│
└── README.md          # This file
```

---

## Quick Start (Local Development)

### 1. Start Backend
```bash
cd backend
npm install
# Create .env (see backend/README.md)
npm run dev
# Runs on http://localhost:5001
```

### 2. Start Frontend
```bash
cd frontend
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm run dev
# Runs on http://localhost:3000
```

---

## Deploying to Azure Web App Service

Both apps are deployed independently as separate Azure Web App Services.

### Deploy Order
1. **Deploy Backend first** → get the backend URL
2. **Deploy Frontend** → set `NEXT_PUBLIC_API_URL` to backend URL

---

### Backend — Azure App Settings

| Setting | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | `your_secure_secret` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_key` |
| `CLOUDINARY_API_SECRET` | `your_secret` |
| `ALLOWED_ORIGINS` | `https://your-frontend-app.azurewebsites.net` |

**Startup Command:**
```
npm run build && npm start
```

---

### Frontend — Azure App Settings

| Setting | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-app.azurewebsites.net/api` |

**Startup Command:**
```
npm run build && npm start
```

---

### GitHub Actions (Recommended — Auto CI/CD)

1. Go to **Azure Portal → App Service → Deployment Center**
2. Connect to **GitHub** → select repo and branch
3. Azure generates a workflow file automatically

For a monorepo, make sure the workflow `cd`s into the correct subdirectory:

```yaml
# Backend workflow
- name: Build backend
  run: |
    cd backend
    npm ci
    npm run build

# Frontend workflow  
- name: Build frontend
  run: |
    cd frontend
    npm ci
    npm run build
```

> 📖 See **[backend/README.md](./backend/README.md)** and **[frontend/README.md](./frontend/README.md)** for detailed deployment steps.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |
| Auth | JWT |
| Hosting | Azure Web App Service |

---

## Admin Setup

After both apps are deployed:

```bash
POST https://your-backend-app.azurewebsites.net/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "your_secure_password",
  "name": "Your Name"
}
```

Then login at: `https://your-frontend-app.azurewebsites.net/admin/login`
