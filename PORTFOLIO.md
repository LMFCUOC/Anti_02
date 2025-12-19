# Mercadona Flow - Portfolio Documentation

## BASIC INFO

| Campo | Valor |
|-------|-------|
| **NAME** | Mercadona Flow |
| **SLUG** | mercadona-flow |
| **TYPE** | APP |
| **STACK** | Vite, React, TypeScript, Tailwind CSS, Zustand |

### CONCEPT

Aplicación web de lista de la compra que optimiza la experiencia de compra en Mercadona, ordenando los productos según el recorrido físico por los pasillos del supermercado.

---

## DETAILS

### OVERVIEW

Mercadona Flow es una Progressive Web App mobile-first diseñada para simplificar las compras. Permite gestionar listas de compra, importar productos desde texto (WhatsApp/Notas), categorizarlos automáticamente entre 200+ categorías, y ordenarlos según la distribución real de una tienda Mercadona configurada por el usuario mediante drag & drop.

### ARCHITECTURE

Arquitectura basada en componentes React con TypeScript. Estado global gestionado con Zustand con persistencia en localStorage. Build optimizado con Vite 7. Estilos con Tailwind CSS v4 y diseño glassmorphism. Drag & drop implementado con @hello-pangea/dnd. Deployment en Vercel con enrutamiento SPA.

### OUTCOME

App funcional desplegada en producción. Permite crear múltiples listas, importación masiva de productos, categorización inteligente automática, modo compra ordenado por pasillos, y configuración personalizada de tiendas. Optimizada para uso con una mano mientras se empuja el carro de la compra.

---

## FLAGS

| Flag | Valor |
|------|-------|
| **FEATURED** | ✅ Sí |
| **ARCHIVED** | ❌ No |

---

## FEATURES

- ✅ Gestión de listas de compra
- ✅ Importación desde texto (pega desde WhatsApp/Notas)
- ✅ Categorización automática de productos (200+ palabras clave)
- ✅ Modo Compra con productos ordenados por pasillos
- ✅ Configuración de tiendas con Drag & Drop
- ✅ Persistencia local (localStorage)
- ✅ Diseño Glassmorphism mobile-first

## TECH STACK

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 7
- **Estado:** Zustand con persistencia
- **Estilos:** Tailwind CSS v4
- **UI:** Componentes custom + Lucide Icons
- **Drag & Drop:** @hello-pangea/dnd

## ROADMAP

- [ ] Autenticación y sincronización en la nube
- [ ] Listas compartidas entre familiares
- [ ] Sugerencias basadas en historial
- [ ] Control de gasto estimado
