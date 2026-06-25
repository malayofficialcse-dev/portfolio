# Portfolio Backend

Professional portfolio backend API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB Atlas** (Cloudinary for file storage).

---

## Features

- **Authentication**: JWT-based admin authentication
- **Skills Management**: Communication, technical, and theoretical skills
- **Projects**: Portfolio projects with images (Cloudinary)
- **Research Papers**: Academic publications with PDF support
- **Books**: Full books and book chapters
- **Certificates**: Professional certifications with images and PDFs
- **Experience & Events**: Work experience and academic events
- **File Uploads**: Cloudinary storage for images and PDFs

---

## Local Development

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS: comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:3000
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
- Azure CLI installed (`az login`)
- Backend code pushed to GitHub

---

### Step 1 — Create an Azure Web App (Backend)

1. Go to **Azure Portal → App Services → Create**
2. Configure:
   - **Runtime stack**: Node.js 20 LTS
   - **Operating System**: Linux (recommended) or Windows
   - **Region**: e.g., Central India
   - **Plan**: Free (F1) for testing, B1+ for production
3. Click **Review + Create**

---

### Step 2 — Configure Application Settings (Environment Variables)

In **App Service → Configuration → Application settings**, add:

| Setting Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | `your_secure_jwt_secret` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_api_key` |
| `CLOUDINARY_API_SECRET` | `your_api_secret` |
| `ALLOWED_ORIGINS` | `https://your-frontend-app.azurewebsites.net` |

> ⚠️ **Never commit `.env` with real secrets to Git.** Use Azure App Settings instead.

---

### Step 3 — Set Startup Command

In **App Service → Configuration → General settings**, set the **Startup Command**:

```
npm run build && npm start
```

Or if using GitHub Actions / Zip Deploy, pre-build locally and set:
```
node dist/server.js
```

---

### Step 4 — Deploy via GitHub Actions (Recommended)

1. In Azure Portal → App Service → **Deployment Center**
2. Select **GitHub** as source
3. Authorize and choose your repo + branch (`main`)
4. Azure auto-generates a GitHub Actions workflow — commit it to your repo
5. The workflow will install dependencies, build TypeScript, and deploy

**Sample workflow file** (auto-generated, located at `.github/workflows/`):
```yaml
- name: Install & Build
  run: |
    cd backend
    npm ci
    npm run build
```

---

### Step 5 — Verify Deployment

Visit your backend URL:
- `https://<your-backend-app>.azurewebsites.net/` → `"Portfolio Backend API is running"`
- `https://<your-backend-app>.azurewebsites.net/health` → `{ "status": "UP" }`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register admin
- `POST /api/auth/login` — Login admin

### Skills
- `GET /api/skills` — Get all skills
- `GET /api/skills/set` — Get skill set
- `PUT /api/skills` — Update skills *(auth required)*

### Projects
- `GET /api/projects` — Get all projects
- `GET /api/projects/:id` — Get single project
- `POST /api/projects` — Create project *(auth required)*
- `PUT /api/projects/:id` — Update project *(auth required)*
- `DELETE /api/projects/:id` — Delete project *(auth required)*

### Research Papers
- `GET /api/research` — Get all papers
- `GET /api/research/:id` — Get single paper
- `POST /api/research` — Create paper *(auth required)*
- `PUT /api/research/:id` — Update paper *(auth required)*
- `DELETE /api/research/:id` — Delete paper *(auth required)*

### Books
- `GET /api/books` — Get all books
- `GET /api/books/:id` — Get single book
- `POST /api/books` — Create book *(auth required)*
- `PUT /api/books/:id` — Update book *(auth required)*
- `DELETE /api/books/:id` — Delete book *(auth required)*

### Certificates
- `GET /api/certificates` — Get all certificates
- `GET /api/certificates/:id` — Get single certificate
- `POST /api/certificates` — Create certificate *(auth required)*
- `PUT /api/certificates/:id` — Update certificate *(auth required)*
- `DELETE /api/certificates/:id` — Delete certificate *(auth required)*

### Experience
- `GET /api/experiences` — Get all experiences
- `POST /api/experiences` — Create experience *(auth required)*
- `PUT /api/experiences/:id` — Update experience *(auth required)*
- `DELETE /api/experiences/:id` — Delete experience *(auth required)*

### Academic / Events
- `GET /api/academics` / `GET /api/events` — Get all
- `POST`, `PUT`, `DELETE` — *(auth required)*

---

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Auth and upload middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── dist/               # Compiled JS (after npm run build)
├── web.config          # Azure App Service IIS config
├── .env                # Local environment variables (gitignored)
├── package.json
└── tsconfig.json
```
