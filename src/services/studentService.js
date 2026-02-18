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

  updateStudent(matricula, payload) {
    const normalizedMatricula = String(matricula || "").trim();
    const nombre = String(payload.nombre || "").trim();

    if (!normalizedMatricula) {
      return {
        ok: false,
        statusCode: 400,
        message: "La matrícula es obligatoria para actualizar."
      };
    }

    if (!nombre) {
      return {
        ok: false,
        statusCode: 400,
        message: "El nombre es obligatorio para actualizar."
      };
    }

    const existingStudent = db.students.find(
      (student) => student.matricula === normalizedMatricula
    );

    if (!existingStudent) {
      return {
        ok: false,
        statusCode: 404,
        message: "No se encontró el alumno para actualizar."
      };
    }

    existingStudent.nombre = nombre;
    existingStudent.updatedAt = new Date().toISOString();
    existingStudent.ultimaOperacion = "actualizacion";

    return {
      ok: true,
      statusCode: 200,
      message: "Alumno actualizado correctamente.",
      data: existingStudent
    };
  }

  deleteStudent(matricula) {
    const normalizedMatricula = String(matricula || "").trim();

    if (!normalizedMatricula) {
      return {
        ok: false,
        statusCode: 400,
        message: "La matrícula es obligatoria para eliminar."
      };
    }

    const index = db.students.findIndex(
      (student) => student.matricula === normalizedMatricula
    );

    if (index === -1) {
      return {
        ok: false,
        statusCode: 404,
        message: "No se encontró el alumno para eliminar."
      };
    }

    const [deletedStudent] = db.students.splice(index, 1);

    return {
      ok: true,
      statusCode: 200,
      message: "Alumno eliminado correctamente.",
      data: deletedStudent
    };
  }
}

module.exports = StudentService;
