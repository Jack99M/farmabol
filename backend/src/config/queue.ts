import { Queue, Worker, Job } from 'bullmq';
import { supabase } from './supabase';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};

export const salesQueue = new Queue('sales-queue', { connection });

// Worker logic to process sales
export const salesWorker = new Worker(
  'sales-queue',
  async (job: Job) => {
    const { productId, quantity } = job.data;
    console.log(`Processing sale for product ${productId}, quantity: ${quantity}`);

    // 1. Get current stock
    const { data: product, error: fetchError } = await supabase
      .from('productos')
      .select('stock, nombre')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.nombre}`);
    }

    // 2. Update stock
    const newStock = product.stock - quantity;
    const { error: updateError } = await supabase
      .from('productos')
      .update({ stock: newStock })
      .eq('id', productId);

    if (updateError) {
      throw new Error(`Failed to update stock for ${productId}`);
    }

    // 3. Check for low stock alert
    if (newStock < 5) {
      console.warn(`ALERT: Low stock for ${product.nombre} (${newStock} units left)`);
    }

    // 4. [NEW] Cloud Storage Simulation: Generate and "Save" QR Receipt
    const receiptName = `receipt-${job.id}.txt`;
    const receiptContent = `Venta: ${job.id}\nProducto: ${product.nombre}\nCantidad: ${quantity}\nTotal: Bs. ${quantity * 10}`; // Simplified total
    
    // Simulating Supabase Storage upload
    console.log(`Uploading ${receiptName} to Supabase Storage bucket 'facturas'...`);
    const { error: storageError } = await supabase.storage
      .from('facturas')
      .upload(receiptName, Buffer.from(receiptContent), {
        contentType: 'text/plain',
        upsert: true
      });

    if (storageError) {
      console.error('Cloud Storage Error (Check if bucket exists):', storageError.message);
      // We don't throw here to avoid failing the whole sale if storage is not configured in Supabase UI
    } else {
      console.log(`Receipt successfully stored in Cloud: ${receiptName}`);
    }

    return { success: true, newStock };
  },
  { connection }
);

// [NEW] Transfer Worker
export const transferWorker = new Worker(
  'transfer-queue', // We can use a different queue or same, but let's use a new one for clarity
  async (job: Job) => {
    const { productId, quantity, fromSucursal, toSucursal } = job.data;
    console.log(`Processing transfer for product ${productId}: ${quantity} units from ${fromSucursal} to ${toSucursal}`);

    // 1. Validate and Update stock (Source)
    const { data: product, error: fetchError } = await supabase
      .from('productos')
      .select('stock, nombre')
      .eq('id', productId)
      .single();

    if (fetchError || !product) throw new Error(`Product ${productId} not found`);
    if (product.stock < quantity) throw new Error(`Insufficient stock for transfer of ${product.nombre}`);

    const { error: updateError } = await supabase
      .from('productos')
      .update({ stock: product.stock - quantity })
      .eq('id', productId);

    if (updateError) throw new Error(`Failed to deduct stock for transfer`);

    console.log(`Transfer successful: ${quantity} units of ${product.nombre} moved to ${toSucursal}`);
    return { success: true };
  },
  { connection }
);

export const transferQueue = new Queue('transfer-queue', { connection });

salesWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

salesWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
