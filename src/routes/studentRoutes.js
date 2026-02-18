// En routes se define el mapa URL -> controlador.
const express = require("express");
const { postAlumnos, getAlumnos } = require("../controllers/studentController");

const router = express.Router();

// Endpoint principal solicitado: registra o reinscribe según body.tipo.
router.post("/alumnos", postAlumnos);

// Endpoint de apoyo para consulta rápida de la base en memoria.
router.get("/alumnos", getAlumnos);

module.exports = router;
