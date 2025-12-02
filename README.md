# Mercadona Flow

Una aplicación web de lista de la compra diseñada para optimizar la experiencia de compra en Mercadona, ordenando los productos según el recorrido físico por los pasillos.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

## 🚀 Características

- ✅ Gestión de listas de compra
- ✅ Importación desde texto (pega desde WhatsApp/Notas)
- ✅ Categorización automática de productos (200+ palabras clave)
- ✅ Modo Compra con productos ordenados por pasillos
- ✅ Configuración de tiendas con Drag & Drop
- ✅ Persistencia local (localStorage)
- ✅ Diseño Glassmorphism mobile-first

## 🛠️ Stack Tecnológico

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 7
- **Estado:** Zustand con persistencia
- **Estilos:** Tailwind CSS v4
- **UI:** Componentes custom + Lucide Icons
- **Drag & Drop:** @hello-pangea/dnd

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview del build de producción
npm run preview
```

## 🌐 Deployment en Vercel

Este proyecto está optimizado para desplegarse en Vercel:

### Opción 1: Deploy desde la interfaz de Vercel

1. Haz push de tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Haz clic en "New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente la configuración:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Haz clic en "Deploy"

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🎯 Uso

1. Abre la app en `http://localhost:5173`
2. Crea una nueva lista o importa desde texto
3. Añade productos (se categorizan automáticamente)
4. Pulsa "Comprar" para ver la lista ordenada por pasillos
5. Marca los productos a medida que los coges

## 📱 Capturas de Pantalla

La app está optimizada para uso móvil con una mano mientras empujas el carro de la compra.

## 🔮 Próximas Versiones

- [ ] Autenticación y sincronización en la nube
- [ ] Listas compartidas entre familiares
- [ ] Sugerencias basadas en historial
- [ ] Control de gasto estimado

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado con ❤️ para hacer la compra más eficiente.
