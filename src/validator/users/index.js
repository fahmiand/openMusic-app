const { UserPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validateResult = UserPayloadSchema.validate(payload)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
  }
}

module.exports = UsersValidator
