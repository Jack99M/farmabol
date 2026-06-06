import { supabase } from './config/supabase';

async function seedSales() {
  console.log('--- Iniciando Poblado de Dashboard de Ventas ---');

  // 1. Obtener los IDs reales de los productos que insertamos antes
  const { data: products, error: prodError } = await supabase
    .from('productos')
    .select('id, nombre');

  if (prodError || !products || products.length === 0) {
    console.error('No se encontraron productos para asociar las ventas:', prodError?.message);
    return;
  }

  console.log(`Asociando ventas a ${products.length} productos encontrados.`);

  // 2. Crear un set de ventas realistas
  const sucursales = ['Sucursal Central', 'Sucursal Norte', 'Sucursal Sur'];
  const ventas = [];

  // Generamos unas 15-20 ventas distribuidas
  for (let i = 0; i < 20; i++) {
    const producto = products[Math.floor(Math.random() * products.length)];
    const cantidad = Math.floor(Math.random() * 5) + 1;
    const fecha = new Date();
    fecha.setHours(fecha.getHours() - Math.floor(Math.random() * 24)); // Ventas en las últimas 24h

    ventas.push({
      producto_id: producto.id,
      cantidad: cantidad,
      sucursal_id: sucursales[Math.floor(Math.random() * sucursales.length)],
      fecha: fecha.toISOString()
    });
  }

  // 3. Intentar insertar (usando el nombre de tabla que definimos en las rutas)
  const { data: inserted, error: ventError } = await supabase
    .from('ventas')
    .insert(ventas)
    .select();

  if (ventError) {
    console.error('Error al poblar ventas:', ventError.message);
    console.log('HINT: Verifica si la tabla se llama "ventas" en Supabase. Si usaste otro nombre, dímelo.');
  } else {
    console.log(`¡Éxito! Se han insertado ${inserted.length} registros de venta.`);
    console.log('Ahora el dashboard debería mostrar gráficos y totales.');
  }

  console.log('--- Proceso Finalizado ---');
}

seedSales();
