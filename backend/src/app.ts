import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/productos.routes';
import ventaRoutes from './routes/ventas.routes';
import transferenciaRoutes from './routes/transferencias.routes';
import './config/queue';

dotenv.config();

const app: Application = express();

// Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middlewares - FIXED CORS for Cloud Deployment
const allowedOrigins = [
    'http://localhost:4200',
    process.env.FRONTEND_URL || '*'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/transferencias', transferenciaRoutes);

// Health Check (No DB)
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend is reachable' });
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Farmabol API' });
});

export default app;
