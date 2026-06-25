# Portfolio Frontend

Professional portfolio frontend built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

---

## Features

- **Dark/Light Mode**: Theme switching with next-themes
- **Responsive Design**: Mobile-first responsive design
- **Skills Display**: Comprehensive skills visualization
- **Projects Showcase**: Portfolio projects with filtering
- **Research Papers**: Academic publications display
- **Books & Chapters**: Books and book chapters showcase
- **Certificates**: Professional certifications display
- **Admin Panel**: Complete admin dashboard for content management
- **Premium UI**: Glassmorphism, gradients, and smooth animations

---

## Local Development

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Create `.env.local`
> **Note:** This file is gitignored — never commit it.

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Start development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## Deploying to Azure Web App Service

### Prerequisites
- Azure account with an active subscription
- Backend already deployed (get its URL first)
- Frontend code pushed to GitHub

---

### Step 1 — Create an Azure Web App (Frontend)

1. Go to **Azure Portal → App Services → Create**
2. Configure:
   - **Runtime stack**: Node.js 20 LTS
   - **Operating System**: Linux (recommended)
   - **Region**: Same region as backend (e.g., Central India)
   - **Plan**: B1 or higher (Free F1 doesn't support custom startup commands well)
3. Click **Review + Create**

---

### Step 2 — Configure Application Settings (Environment Variables)

In **App Service → Configuration → Application settings**, add:

| Setting Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-app.azurewebsites.net/api` |

> ✅ `NEXT_PUBLIC_API_URL` tells the frontend where to call the backend API.
> Replace `your-backend-app` with your actual backend App Service name.

---

### Step 3 — Set Startup Command

In **App Service → Configuration → General settings**, set the **Startup Command**:

```
npm run build && npm start
```

Or if deploying a pre-built app via GitHub Actions:
```
npm start
```

> **Note**: `next start` serves the production build on port 3000 by default.
> Azure App Service maps port 80/443 → `PORT` env var automatically — Next.js respects `process.env.PORT`.

---

### Step 4 — Deploy via GitHub Actions (Recommended)

1. In Azure Portal → App Service → **Deployment Center**
2. Select **GitHub** as source
3. Authorize and choose your repo + branch (`main`)
4. Azure auto-generates a GitHub Actions workflow

**Sample workflow steps**:
```yaml
- name: Install & Build
  run: |
    cd frontend
    npm ci
    npm run build

- name: Deploy to Azure
  uses: azure/webapps-deploy@v3
  with:
    app-name: your-frontend-app
    package: ./frontend
```

---

### Step 5 — Verify Deployment

Visit your frontend URL:
- `https://<your-frontend-app>.azurewebsites.net/` → Portfolio home page
- `https://<your-frontend-app>.azurewebsites.net/admin/login` → Admin login

---

## Pages

### Public Pages
- `/` — Home page with hero and features
- `/skills` — Skills showcase
- `/projects` — Projects portfolio
- `/research` — Research papers
- `/books` — Books and chapters
- `/certificates` — Certificates and achievements

### Admin Pages
- `/admin/login` — Admin login
- `/admin/dashboard` — Admin dashboard
- `/admin/skills` — Skills management
- `/admin/projects` — Projects management
- `/admin/research` — Research papers management
- `/admin/books` — Books management
- `/admin/certificates` — Certificates management

---

## Admin Access

To create an admin account, call the backend API:

```bash
POST https://your-backend-app.azurewebsites.net/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "your_password",
  "name": "Admin Name"
}
```

Then login at `/admin/login`.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── admin/         # Admin pages
│   │   ├── skills/        # Skills page
│   │   ├── projects/      # Projects page
│   │   ├── research/      # Research page
│   │   ├── books/         # Books page
│   │   ├── certificates/  # Certificates page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   ├── lib/               # API client (api.ts)
│   └── types/             # TypeScript types
├── public/                # Static files
├── web.config             # Azure App Service IIS config
├── next.config.ts         # Next.js configuration
├── .env.local             # Local env variables (gitignored)
├── package.json
└── tsconfig.json
```
