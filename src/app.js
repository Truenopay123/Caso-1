// app.js construye la aplicación Express y centraliza middlewares/rutas.
const express = require("express");
const path = require("path");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware para leer JSON en peticiones.
app.use(express.json());

// Servir frontend estático (cliente web en carpeta public).
app.use(express.static(path.join(__dirname, "..", "public")));

// Ruta de salud para confirmar que el backend está en línea.
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Servidor activo" });
});

// API de alumnos.
app.use("/", studentRoutes);

module.exports = app;
