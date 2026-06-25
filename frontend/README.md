# Portfolio Frontend

Professional portfolio frontend built with Next.js 14, TypeScript, and Tailwind CSS.

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

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (note: this file is gitignored):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Pages

### Public Pages
- `/` - Home page with hero and features
- `/skills` - Skills showcase
- `/projects` - Projects portfolio
- `/research` - Research papers
- `/books` - Books and chapters
- `/certificates` - Certificates and achievements

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/skills` - Skills management
- `/admin/projects` - Projects management
- `/admin/research` - Research papers management
- `/admin/books` - Books management
- `/admin/certificates` - Certificates management

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
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
├── public/                # Static files
├── .env.local             # Environment variables (gitignored)
├── package.json
└── tsconfig.json
```

## Theme

The application supports both dark and light modes with custom CSS variables:

- Dark mode: Deep blacks with vibrant accents
- Light mode: Clean whites with colorful gradients
- Smooth transitions between themes
- Persistent theme selection

## Admin Access

To create an admin account, use the backend API:

```bash
POST http://localhost:5000/api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "your_password",
  "name": "Admin Name"
}
```

Then login at `/admin/login` with your credentials.
