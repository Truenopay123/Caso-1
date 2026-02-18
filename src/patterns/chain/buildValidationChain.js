const NameValidator = require("./NameValidator");
const MatriculaValidator = require("./MatriculaValidator");
const ProcessTypeValidator = require("./ProcessTypeValidator");

// Construye la cadena completa de validación en el orden solicitado.
function buildValidationChain() {
  const nameValidator = new NameValidator();
  const matriculaValidator = new MatriculaValidator();
  const processTypeValidator = new ProcessTypeValidator();

  nameValidator
    .setNext(matriculaValidator)
    .setNext(processTypeValidator);

  return nameValidator;
}

module.exports = buildValidationChain;
