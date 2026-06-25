import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import skillRoutes from './routes/skillRoutes';
import projectRoutes from './routes/projectRoutes';
import researchRoutes from './routes/researchRoutes';
import bookRoutes from './routes/bookRoutes';
import certificateRoutes from './routes/certificateRoutes';
import experienceRoutes from './routes/experienceRoutes';
import academicRoutes from './routes/academicRoutes';
import eventRoutes from './routes/eventRoutes';

const app = express();

// CORS — in production, restrict to your frontend Azure Web App URL.
// Set ALLOWED_ORIGINS in Azure App Settings (comma-separated list of allowed origins).
// Example: https://your-frontend-app.azurewebsites.net,https://yourdomain.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000','http://localhost:3001','http://localhost:5174','http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from root uploads directory
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('[STATIC] Serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Debug middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
    next();
});

// Root routes
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/events', eventRoutes);

// Global Error Handler for undefined routes
app.use((req, res, next) => {
    console.log(`[404] ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Not Found',
        path: req.originalUrl,
        method: req.method
    });
});

// Final Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[SERVER ERROR]', err);

    // Multer error handling
    if (err.name === 'MulterError' || err instanceof multer.MulterError) {
        let message = err.message;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size too large. Maximum limit is 10MB';
        }
        return res.status(400).json({
            message,
            error: 'MulterError',
            code: err.code
        });
    }

    // Validation error handling (Mongoose etc.)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Failed',
            error: err.message,
            details: err.errors
        });
    }

    // Custom "Only images" error
    if (err instanceof Error && (err.message.includes('Only images') || err.message.includes('allowed') || err.message.includes('Validation Failed'))) {
        return res.status(400).json({
            message: err.message,
            error: 'Bad Request'
        });
    }

    res.status(500).json({
        message: 'An unexpected internal server error occurred',
        error: err.message || 'Internal Server Error'
    });
});

export default app;
