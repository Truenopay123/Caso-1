// En routes se define el mapa URL -> controlador.
const express = require("express");
const {
	postAlumnos,
	getAlumnos,
	putAlumno,
	deleteAlumno
} = require("../controllers/studentController");

const router = express.Router();

// Endpoint principal solicitado: registra o reinscribe según body.tipo.
router.post("/alumnos", postAlumnos);

// Endpoint de apoyo para consulta rápida de la base en memoria.
router.get("/alumnos", getAlumnos);

// Actualizar alumno por matrícula.
router.put("/alumnos/:matricula", putAlumno);

// Eliminar alumno por matrícula.
router.delete("/alumnos/:matricula", deleteAlumno);

module.exports = router;
