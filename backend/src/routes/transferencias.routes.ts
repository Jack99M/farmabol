import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { transferQueue } from '../config/queue';

const router = Router();

// Create a transfer
router.post('/', async (req: Request, res: Response) => {
    const { productId, quantity, fromSucursal, toSucursal } = req.body;

    try {
        // 1. Log transfer in DB
        const { data: transfer, error } = await supabase
            .from('transferencias')
            .insert([{ 
                producto_id: productId, 
                cantidad: quantity, 
                sucursal_origen: fromSucursal,
                sucursal_destino: toSucursal,
                fecha: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });

        // 2. Queue the stock movement
        await transferQueue.add('process-transfer', { 
            productId, 
            quantity, 
            fromSucursal, 
            toSucursal 
        });

        res.status(202).json({ message: 'Transfer queued', transfer });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
});

export default router;
