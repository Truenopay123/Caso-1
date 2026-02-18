const StudentService = require("../services/studentService");
const StudentServiceProxy = require("../patterns/proxy/studentServiceProxy");
const buildValidationChain = require("../patterns/chain/buildValidationChain");

// Instancias principales del módulo.
const realService = new StudentService();
const proxyService = new StudentServiceProxy(realService);
const validationChain = buildValidationChain();

function getAuthHeader(req) {
  return req.headers.authorization || "";
}

// Controlador de POST /alumnos
function postAlumnos(req, res) {
  // 1) Chain of Responsibility: validación de nombre, matrícula y tipo.
  const validationResult = validationChain.validate({ payload: req.body });
  if (!validationResult.ok) {
    return res.status(validationResult.statusCode || 400).json(validationResult);
  }

  // 2) Proxy: control de autenticación por token.
  const result = proxyService.processStudent(req.body, getAuthHeader(req));
  return res.status(result.statusCode || 200).json(result);
}

// Endpoint adicional de apoyo para inspección de datos en memoria.
function getAlumnos(req, res) {
  const result = proxyService.listStudents(getAuthHeader(req));
  return res.status(result.statusCode || 200).json(result);
}

module.exports = {
  postAlumnos,
  getAlumnos
};
