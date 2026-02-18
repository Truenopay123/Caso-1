const { API_TOKEN } = require("../../config/constants");

// Proxy del servicio de alumnos.
// Objetivo: controlar autenticación por token antes de acceder al servicio real.
class StudentServiceProxy {
  constructor(realService) {
    this.realService = realService;
  }

  authenticate(rawAuthHeader) {
    if (!rawAuthHeader || typeof rawAuthHeader !== "string") {
      return {
        ok: false,
        statusCode: 401,
        message: "Token no enviado. Usa el header Authorization."
      };
    }

    const token = rawAuthHeader.replace(/^Bearer\s+/i, "").trim();

    if (token !== API_TOKEN) {
      return {
        ok: false,
        statusCode: 403,
        message: "Token inválido. Acceso denegado por Proxy."
      };
    }

    return { ok: true };
  }

  // Operación protegida para POST /alumnos
  processStudent(payload, rawAuthHeader) {
    const auth = this.authenticate(rawAuthHeader);
    if (!auth.ok) {
      return auth;
    }

    return this.realService.processStudent(payload);
  }

  // Operación protegida opcional para revisar alumnos.
  listStudents(rawAuthHeader) {
    const auth = this.authenticate(rawAuthHeader);
    if (!auth.ok) {
      return auth;
    }

    return this.realService.listStudents();
  }

  updateStudent(matricula, payload, rawAuthHeader) {
    const auth = this.authenticate(rawAuthHeader);
    if (!auth.ok) {
      return auth;
    }

    return this.realService.updateStudent(matricula, payload);
  }

  deleteStudent(matricula, rawAuthHeader) {
    const auth = this.authenticate(rawAuthHeader);
    if (!auth.ok) {
      return auth;
    }

    return this.realService.deleteStudent(matricula);
  }
}

module.exports = StudentServiceProxy;
