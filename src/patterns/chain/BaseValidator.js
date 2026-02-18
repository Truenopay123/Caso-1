// Clase base del patrón Chain of Responsibility.
// Cada validador puede procesar su regla y delegar al siguiente.
class BaseValidator {
  setNext(nextValidator) {
    this.nextValidator = nextValidator;
    return nextValidator;
  }

  validate(context) {
    if (this.nextValidator) {
      return this.nextValidator.validate(context);
    }

    return { ok: true };
  }
}

module.exports = BaseValidator;
