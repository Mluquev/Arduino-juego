# Setup e Instalación

## Limpiar archivos innecesarios (backend local)

Como la app solo consume datos de `https://arduino.arroyocreativa.com`, puedes eliminar estos archivos:

```bash
# En tu máquina local:
rm -f server.js package.json package-lock.json test-*.js
rm -rf node_modules
```

## Estructura final (solo frontend)

```
Arduino-juego/
├── frontend/              # 👈 Única carpeta que necesitas
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos oscuro + verde
│   └── app.js             # Cliente WebSocket
├── PDR.md                 # Documento de requisitos
├── README.md              # Documentación
├── SETUP.md               # Este archivo
└── .gitignore
```

## Opción 1: Ejecutar localmente

### Con Python 3
```bash
cd frontend
python3 -m http.server 8000
# Abre: http://localhost:8000
```

### Con Node.js / Vercel
```bash
npx http-server frontend -p 8000
# Abre: http://localhost:8000
```

### Directamente (navegador)
```bash
open frontend/index.html
# o en Windows:
start frontend\index.html
```

## Opción 2: Desplegar públicamente

### GitHub Pages
1. Sube el repo a GitHub
2. Ve a Settings → Pages
3. Selecciona "Deploy from a branch"
4. Branch: `main`, Folder: `/frontend`
5. URL pública: `https://tu-usuario.github.io/Arduino-juego`

### Vercel
```bash
npm i -g vercel
# En la carpeta del proyecto:
vercel --prod
# Configura /frontend como root directory
```

### Netlify (Drop & Deploy)
1. Ve a https://netlify.com
2. Arrastra la carpeta `frontend` a la zona de drop
3. Listo: URL pública inmediata

## Características

✅ **Consumidor puro de datos** — Sin backend local  
✅ **Estático** — Se puede hostear gratis (GitHub Pages, Netlify)  
✅ **Responsive** — Desktop, tablet, móvil  
✅ **Tiempo real** — WebSocket + fallback REST  
✅ **Educativo** — Interfaz amigable para primaria  

## API Remota

- **WebSocket:** `wss://arduino.arroyocreativa.com`
- **REST:** `https://arduino.arroyocreativa.com/api/data`
- **Status:** `https://arduino.arroyocreativa.com/api/status`

La app se conecta automáticamente y muestra:
- Luz (iluminación)
- Temperatura
- Acelerómetro (X/Y/Z)
- Micrófono

## Solución de problemas

### "Refused to connect to socket"
- Verifica que `https://arduino.arroyocreativa.com` esté en línea
- La conexión debe ser HTTPS → WSS (no WS)

### "CORS error"
- No debería ocurrir, la API remota tiene CORS habilitado
- Si sucede, usa el fallback REST (polling)

### "Script/CSS not loading"
- Verifica que los archivos estén en `frontend/`
- Los MIME types están configurados correctamente en los archivos

Más info: Ver `README.md`
