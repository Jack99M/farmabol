import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { salesQueue } from '../config/queue';

const router = Router();

// Create a sale (Async via Queue)
router.post('/', async (req: Request, res: Response) => {
    const { productId, quantity, sucursalId } = req.body;

    try {
        // 1. Register the sale record in Supabase (immediate)
        const { data: sale, error } = await supabase
            .from('ventas')
            .insert([{ 
                producto_id: productId, 
                cantidad: quantity, 
                sucursal_id: sucursalId,
                fecha: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to record sale', details: error.message });
        }

        // 2. Add job to queue for stock update and async processing
        await salesQueue.add('process-sale', { 
            saleId: sale.id, 
            productId, 
            quantity 
        });

        res.status(202).json({ 
            message: 'Sale registered and queued for processing', 
            sale 
        });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get all sales
router.get('/', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('ventas')
            .select('*, productos(nombre)');

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
