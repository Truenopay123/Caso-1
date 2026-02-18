# Universidad - Client/Server con Express

Aplicación completa de arquitectura Cliente-Servidor para:
- Registrar alumnos nuevos
- Reinscribir alumnos existentes

Incluye:
- Patrón Proxy para control de autenticación con token
- Patrón Chain of Responsibility para validaciones
- Backend Express + frontend HTML/CSS/JS
- Base de datos en memoria

---

## Mapa de comunicación entre carpetas

```text
public/ (cliente)
   │
   │ 1) fetch POST /alumnos (envía nombre, matricula, tipo, token)
   ▼
src/routes/ (router Express)
   │
   │ 2) enruta a controller
   ▼
src/controllers/ (orquestación)
   │
   ├─ 3) valida body con src/patterns/chain/
   │      (NameValidator -> MatriculaValidator -> ProcessTypeValidator)
   │
   └─ 4) llama a src/patterns/proxy/studentServiceProxy.js
            (valida token)
              │
              │ 5) si token OK, delega a
              ▼
            src/services/studentService.js
              │
              │ 6) registra/reinscribe en
              ▼
            src/database/memoryDb.js (array en memoria)
              │
              └─ 7) retorna respuesta al controller -> cliente (public/)
```

---

## Qué hace cada carpeta

### public/
- Contiene el cliente web (UI).
- `index.html`: formulario con campos en español.
- `styles.css`: diseño tipo card moderno.
- `app.js`: captura formulario y hace `fetch` a `POST /alumnos`.

### src/config/
- Configuración global del backend.
- `constants.js`: puerto del servidor y token esperado.

### src/database/
- Simulación de base de datos en memoria.
- `memoryDb.js`: array `students` que vive mientras el servidor está activo.

### src/patterns/chain/
- Implementación del patrón Chain of Responsibility.
- `BaseValidator.js`: clase base para encadenar validadores.
- `NameValidator.js`: valida nombre.
- `MatriculaValidator.js`: valida matrícula.
- `ProcessTypeValidator.js`: valida `tipo` (`nuevo | reinscripcion`).
- `buildValidationChain.js`: arma el orden de la cadena.

### src/patterns/proxy/
- Implementación del patrón Proxy.
- `studentServiceProxy.js`: intercepta peticiones, valida token y delega al servicio real.

### src/services/
- Lógica de negocio del dominio.
- `studentService.js`: aplica reglas de registro/reinscripción y responde con estado.

### src/controllers/
- Orquesta el flujo de la petición.
- `studentController.js`: ejecuta Chain, luego Proxy, y devuelve respuesta HTTP.

### src/routes/
- Define endpoints de la API.
- `studentRoutes.js`: registra `POST /alumnos` y `GET /alumnos`.

### src/
- `app.js`: crea la app Express, middlewares y rutas.
- `server.js`: levanta el servidor (`app.listen`).

---

## Estructura de carpetas

```text
CASO1_UNIVERSIDAD/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  └─ constants.js
│  ├─ controllers/
│  │  └─ studentController.js
│  ├─ database/
│  │  └─ memoryDb.js
│  ├─ patterns/
│  │  ├─ proxy/
│  │  │  └─ studentServiceProxy.js
│  │  └─ chain/
│  │     ├─ BaseValidator.js
│  │     ├─ NameValidator.js
│  │     ├─ MatriculaValidator.js
│  │     ├─ ProcessTypeValidator.js
│  │     └─ buildValidationChain.js
│  ├─ routes/
│  │  └─ studentRoutes.js
│  └─ services/
│     └─ studentService.js
├─ requests.http
├─ package.json
└─ .gitignore
```

---

## Cómo ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar servidor:

```bash
npm start
```

3. Abrir en navegador:

- http://localhost:3000

Token por defecto esperado por el Proxy:

- `TOKEN_UNIVERSIDAD_2026`

---

## Endpoint principal

### `POST /alumnos`

Body esperado:

```json
{
  "nombre": "Ana Lopez",
  "matricula": "A2026001",
  "tipo": "nuevo"
}
```

Valores válidos de `tipo`:
- `nuevo`
- `reinscripcion`

---

## Pruebas rápidas

Usa `requests.http` para probar:
- Registro nuevo
- Reinscripción
- Error por token inválido
- Error por tipo inválido

También puedes probar desde `public/index.html`.
