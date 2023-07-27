const ExportPlaylistPayloadSchema = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const ExportsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const validateResult = ExportPlaylistPayloadSchema.validate(payload)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
  }
}

module.exports = ExportsValidator
