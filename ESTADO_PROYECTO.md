# 📑 ESTADO DEL PROYECTO: FARMABOL (Hito 3 + Hito 4)

Este documento contiene todo el contexto necesario para continuar el desarrollo del proyecto de Evaluación Grupal Final.

## 🚀 Información General
- **Proyecto Elegido:** 6. FARMABOL - Sistema de Inventarios y Ventas.
- **Estado Actual:** Cimientos sólidos, Backend conectado a DB, Frontend funcional (Inventario).
- **Commits Realizados:** 8 de 8 requeridos (Mínimo).

---

## 🛠️ Stack Tecnológico
- **Frontend:** Angular 21 (Modo Zoneless) + Tailwind CSS v4.
- **Backend:** Node.js + Express + TypeScript.
- **Base de Datos:** Supabase (PostgreSQL).
- **Estilos:** CSS Profesional inyectado en `styles.css`.

---

## ✅ Lo que ya funciona (Done)
1. **Estructura Monorepo:** `/backend` y `/frontend`.
2. **Base de Datos:** Tabla `productos` creada en Supabase.
3. **Backend API:** Endpoints `GET /api/productos` y `POST /api/ventas` funcionales.
4. **Middleware:** Cola de mensajes (BullMQ + Redis) para procesamiento asíncrono de ventas.
5. **Frontend Angular:** Inventario con botón "Vender" y Historial de Ventas refactorizado.

---

## 📋 LISTA DE CONTROL (Según HTML de la Evaluación)

### 🚨 Requisitos de Commits (Mínimo 8)
- [x] Commit 1: Estructura base.
- [x] Commit 2: Backend Skeleton.
- [x] Commit 3: Frontend Base.
- [x] Commit 4: Integración Supabase.
- [x] Commit 5: Frontend Styled & Connected.
- [x] Commit 6: Lógica de Ventas & Queue Middleware.
- [x] Commit 7: ANTES de Refactorizar (Sales History Draft).
- [x] Commit 8: DESPUÉS de Refactorizar (Clean Code & Service abstraction).

### 🏛️ Hito 3 - Arquitectura y Middleware
- [x] **Justificación de Arquitectura:** Monolítica Modular (Ver `docs/ARQUITECTURA.md`).
- [x] **Middleware (Message Queue):** Implementada cola BullMQ para stock y alertas.
- [x] **Refactorización:** Evidenciado en Commits 7 y 8.
- [x] **UML:** Diagrama de clases y secuencia (Ver `docs/UML.md`).

### 📊 Hito 4 - Calidad y Cloud
- [x] **SQA:** Ejecutado ESLint y corregidos 3 issues (Ver `docs/CALIDAD.md`).
- [x] **Confiabilidad:** Calculado MTBF (720h) y Disponibilidad (99.93%).
- [x] **ISO 9000 / PDCA:** Documentado ciclo PDCA para stock (Ver `docs/CALIDAD.md`).
- [x] **Cloud Computing:** Listo para desplegar en Render/Vercel.
- [x] **Cloud Storage:** Implementada simulación de subida de facturas a Supabase Storage.

---

## 🔑 Credenciales y Rutas
- **Backend:** `http://localhost:4000/api/productos`
- **Frontend:** `http://localhost:4200`
- **Supabase URL:** `https://rdytdmsssrdqaynmkejf.supabase.co`

---

## 🎯 Próximos Pasos Inmediatos
1. Implementar la **lógica de Ventas** (POST) en el Backend.
2. Crear la **cola de mensajes** (Middleware) para el procesamiento asíncrono.
3. Preparar la documentación técnica en la carpeta `/docs`.
