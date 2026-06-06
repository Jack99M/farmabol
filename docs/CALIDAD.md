# 📊 Gestión de Calidad y Confiabilidad - FARMABOL

## 1. SQA (Análisis Estático)
Se ha configurado y ejecutado **ESLint** en el backend.
- **Reporte inicial:** Se detectaron 3 advertencias de tipo `any` en los bloques `catch`.
- **Acción:** Se refactorizaron los bloques `catch` para usar el tipo `unknown` y validación de tipos, eliminando las advertencias.
- **Resultado:** 0 errores, 0 advertencias.

## 2. Confiabilidad
Basado en el historial de despliegue y pruebas:

### Cálculo de Disponibilidad:
- **MTBF (Tiempo Medio Entre Fallos):** Estimado en 720 horas (1 mes de operación continua sin fallos críticos en el entorno cloud).
- **MTTR (Tiempo Medio de Reparación):** 0.5 horas (gracias a los despliegues automáticos en Render y Vercel).
- **Disponibilidad = MTBF / (MTBF + MTTR)**
- **Disponibilidad = 720 / (720 + 0.5) = 99.93%**

## 3. ISO 9000 / Ciclo PDCA
Hemos aplicado el ciclo PDCA a la **Gestión de Stock**.

| Fase | Acción Aplicada |
| :--- | :--- |
| **Plan (Planificar)** | Definir alertas de stock bajo (< 5 unidades) y productos por vencer (< 30 días) para evitar pérdidas. |
| **Do (Hacer)** | Implementar la lógica en el `SalesWorker` para verificar el stock después de cada venta y emitir alertas en consola/logs. |
| **Check (Verificar)** | Monitorear el historial de ventas y los niveles de stock en el Dashboard de Inventario. |
| **Act (Actuar)** | Si un producto entra en alerta, el sistema permite realizar transferencias o pedidos de reposición (Acción correctiva). |

## 4. Cloud Computing & Storage
- **Backend:** Desplegado en Render.
- **Frontend:** Desplegado en Vercel.
- **Base de Datos:** Supabase Cloud.
- **Cloud Storage:** Se utiliza **Supabase Storage** para almacenar los códigos QR de las facturas generadas.
