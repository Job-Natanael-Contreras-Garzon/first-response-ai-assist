# Configuración de CORS para el Backend

## Problema
El frontend no puede conectarse al backend debido a políticas CORS (Cross-Origin Resource Sharing).

## Error actual
```
Access to fetch at 'https://tsm6f0gh-8081.brs.devtunnels.ms/chat' from origin 'http://localhost:8080' has been blocked by CORS policy
```

## Soluciones para el Backend

### Si usas Express.js:

1. **Instalar cors:**
```bash
npm install cors
npm install @types/cors  # Si usas TypeScript
```

2. **Configurar CORS en tu servidor:**
```javascript
const cors = require('cors');
const express = require('express');
const app = express();

// Permitir CORS para todos los orígenes (desarrollo)
app.use(cors());

// O configuración más específica (producción)
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept']
}));
```

### Si usas Python/FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Si usas otro framework:
Busca la documentación específica para configurar CORS en tu framework.

## Configuración Actual del Frontend
- URL Base: `https://tsm6f0gh-8081.brs.devtunnels.ms`
- Endpoint: `/chat`
- Puerto Frontend: `8080`

## Test de Conexión
Una vez configurado CORS en el backend, puedes probar la conexión usando el método `testConnection()` disponible en `backendAPI.ts`.
