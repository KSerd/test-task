const Ajv = require('ajv');

const prepositionsPost = require('../json-schemas/prepositions-post');
const prepositionsPut = require('../json-schemas/prepositions-put');

class SchemaValidator {

  constructor(options) {
    this.ajv = Ajv(options);

    this.ajv.addSchema(prepositionsPost, 'prepositions-post');
    this.ajv.addSchema(prepositionsPut, 'prepositions-put');
  }

  validateSchema(schemaName) {
    return (req, res, next) => {
      let valid = this.ajv.validate(schemaName, req.body);
      if (!valid) {
        return res.status(400).json(this.errorResponse(this.ajv.errors));
      }
      next();
    };
  }

  errorResponse(schemaErrors) {
    let errors = schemaErrors.map((error) => {
      return {
        path: error.dataPath,
        message: error.message
      };
    });
    return {
      message: 'Validation failed',
      errors: errors
    };
  }
}

module.exports = SchemaValidator;