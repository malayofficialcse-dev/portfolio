# Portfolio Backend

Professional portfolio backend API built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication**: JWT-based admin authentication
- **Skills Management**: Communication, technical, and theoretical skills
- **Projects**: Portfolio projects with images
- **Research Papers**: Academic publications with PDF support
- **Books**: Full books and book chapters
- **Certificates**: Professional certifications with images and PDFs
- **File Uploads**: Support for images and PDF files

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/set` - Get skill set
- `PUT /api/skills` - Update skills (auth required)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Research Papers
- `GET /api/research` - Get all papers
- `GET /api/research/:id` - Get single paper
- `POST /api/research` - Create paper (auth required)
- `PUT /api/research/:id` - Update paper (auth required)
- `DELETE /api/research/:id` - Delete paper (auth required)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (auth required)
- `PUT /api/books/:id` - Update book (auth required)
- `DELETE /api/books/:id` - Delete book (auth required)

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:id` - Get single certificate
- `POST /api/certificates` - Create certificate (auth required)
- `PUT /api/certificates/:id` - Update certificate (auth required)
- `DELETE /api/certificates/:id` - Delete certificate (auth required)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Auth and upload middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```
