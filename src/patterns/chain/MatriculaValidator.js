const BaseValidator = require("./BaseValidator");

// Valida la matrícula con un formato alfanumérico básico.
class MatriculaValidator extends BaseValidator {
  validate(context) {
    const { matricula } = context.payload;
    const regex = /^[A-Za-z0-9-]{5,20}$/;

    if (typeof matricula !== "string" || !regex.test(matricula.trim())) {
      return {
        ok: false,
        statusCode: 400,
        message: "La matrícula es obligatoria y debe ser alfanumérica (5 a 20 caracteres)."
      };
    }

    return super.validate(context);
  }
}

module.exports = MatriculaValidator;
