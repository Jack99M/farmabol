import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/productos.routes';

dotenv.config();

const app: Application = express();

// Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middlewares - FIXED CORS for Angular
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/productos', productoRoutes);

// Health Check (No DB)
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend is reachable' });
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Farmabol API' });
});

export default app;
