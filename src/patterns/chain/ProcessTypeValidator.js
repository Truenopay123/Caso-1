const BaseValidator = require("./BaseValidator");

// Valida el tipo de proceso permitido: nuevo o reinscripcion.
class ProcessTypeValidator extends BaseValidator {
  validate(context) {
    const { tipo } = context.payload;

    if (tipo !== "nuevo" && tipo !== "reinscripcion") {
      return {
        ok: false,
        statusCode: 400,
        message: "El tipo de proceso debe ser 'nuevo' o 'reinscripcion'."
      };
    }

    return super.validate(context);
  }
}

module.exports = ProcessTypeValidator;
