import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        console.log('--- NEW REQUEST: GET /api/productos ---');
        console.log('Fetching products from Supabase...');
        const { data, error, status, statusText } = await supabase
            .from('productos')
            .select('*');

        if (error) {
            console.error('Supabase error detected:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                status,
                statusText
            });
            return res.status(500).json({ error: error.message });
        }
        
        console.log('Data successfully received. Row count:', data?.length);
        res.json(data);
    } catch (err: unknown) {
        const error = err as Error;
        console.error('CRITICAL CATCH ERROR:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message,
            type: error.name 
        });
    }
});

// Create a product
router.post('/', async (req: Request, res: Response) => {
    const { codigo, nombre, precio, stock, fecha_vencimiento } = req.body;
    const { data, error } = await supabase
        .from('productos')
        .insert([{ codigo, nombre, precio, stock, fecha_vencimiento }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

export default router;
