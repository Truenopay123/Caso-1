const db = require("../database/memoryDb");

// Servicio real del dominio de alumnos.
// Esta clase contiene la lógica de negocio (registro y reinscripción).
class StudentService {
  processStudent(payload) {
    const nombre = payload.nombre.trim();
    const matricula = payload.matricula.trim();
    const tipo = payload.tipo;

    const existingStudent = db.students.find((student) => student.matricula === matricula);

    // Caso 1: Registro de alumno nuevo
    if (tipo === "nuevo") {
      if (existingStudent) {
        return {
          ok: false,
          statusCode: 409,
          message: "No se puede registrar: la matrícula ya existe."
        };
      }

      const newStudent = {
        nombre,
        matricula,
        estado: "activo",
        ultimaOperacion: "registro_nuevo",
        updatedAt: new Date().toISOString()
      };

      db.students.push(newStudent);

      return {
        ok: true,
        statusCode: 201,
        message: "Alumno registrado correctamente.",
        data: newStudent
      };
    }

    // Caso 2: Reinscripción de alumno existente
    if (!existingStudent) {
      return {
        ok: false,
        statusCode: 404,
        message: "No se puede reinscribir: la matrícula no existe."
      };
    }

    existingStudent.nombre = nombre;
    existingStudent.estado = "activo";
    existingStudent.ultimaOperacion = "reinscripcion";
    existingStudent.updatedAt = new Date().toISOString();

    return {
      ok: true,
      statusCode: 200,
      message: "Alumno reinscrito correctamente.",
      data: existingStudent
    };
  }

  // Método adicional de apoyo para revisar estado de la base en memoria.
  listStudents() {
    return {
      ok: true,
      statusCode: 200,
      data: db.students
    };
  }
}

module.exports = StudentService;
