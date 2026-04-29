# Arduino-juego

Aplicación web educativa para visualizar datos del Arduino Esplora en tiempo real.

**Datos en vivo desde:** `https://arduino.arroyocreativa.com`

## Características

- 🌍 Interface amigable con tema oscuro y acentos verdes
- ⚡ Visualización en tiempo real de sensores vía WebSocket
- 📊 Gráficos interactivos de luz, temperatura, acelerómetro y micrófono
- 🔄 Fallback automático a REST polling si WebSocket falla
- 📱 Responsive para desktop y tablet
- 🎨 Formas orgánicas y animaciones suaves

## Uso rápido

Simplemente abre `frontend/index.html` en tu navegador (o sirve la carpeta con cualquier servidor HTTP):

### Opción 1: Abrir directamente
```bash
open frontend/index.html
# o en Windows/Linux
start frontend/index.html
```

### Opción 2: Servidor local (Python)
```bash
cd frontend
python3 -m http.server 8000
# Luego: http://localhost:8000
```

### Opción 3: Con Node.js
```bash
npx http-server frontend -p 8000
# Luego: http://localhost:8000
```

### Opción 4: Deploy a GitHub Pages / Vercel
Sube la carpeta `frontend` y configura como sitio público.

## Estructura del Proyecto

```
.
├── frontend/
│   ├── index.html      # Interfaz principal
│   ├── style.css       # Estilos oscuros y verdes
│   └── app.js          # Cliente WebSocket + gráficos
├── PDR.md              # Documento de requisitos
└── README.md           # Este archivo
```

## API Remota

La app se conecta automáticamente a:

| Tipo | URL |
|------|-----|
| **WebSocket** | `wss://arduino.arroyocreativa.com` |
| **REST** | `https://arduino.arroyocreativa.com/api/data` |

### Sensores disponibles

- **☀️ Luz** — Fotoresistor (0-1023)
- **🌡️ Temperatura** — Sensor térmico (°C)
- **⚡ Acelerómetro** — Movimiento e inclinación (X/Y/Z)
- **🎙️ Micrófono** — Sonido ambiente (0-1023)
- **🕹️ Joystick** — Controles X/Y
- **🎚️ Slider** — Potenciómetro lineal
- **🔘 Botones** — Btn1, Btn2, Btn3, Btn4

## Requisitos (del PDR)

✅ **Experiencia educativa ambiental** — Luz y radiación UV  
✅ **Inclinación del terreno** — Acelerómetro  
✅ **Elementos lúdicos y artísticos** — UI interactiva  
✅ **Público:** Primaria (orientado a niños, muy visual)

## Licencia

MIT
