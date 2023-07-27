const { ImageHeadersSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validateResult = ImageHeadersSchema.validate(headers)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
  }
}

module.exports = UploadsValidator
