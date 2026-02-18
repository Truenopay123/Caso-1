const BaseValidator = require("./BaseValidator");

// Valida el nombre del alumno.
class NameValidator extends BaseValidator {
  validate(context) {
    const { nombre } = context.payload;

    if (typeof nombre !== "string" || nombre.trim().length < 3) {
      return {
        ok: false,
        statusCode: 400,
        message: "El nombre es obligatorio y debe tener al menos 3 caracteres."
      };
    }

    return super.validate(context);
  }
}

module.exports = NameValidator;
