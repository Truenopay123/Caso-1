// server.js es el punto de arranque del backend.
// Aquí se levanta el servidor HTTP usando la app de Express.
const app = require("./app");
const { PORT, API_TOKEN } = require("./config/constants");

app.listen(PORT, () => {
  // Logs de ayuda para desarrollo local.
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Token esperado por Proxy: ${API_TOKEN}`);
});
