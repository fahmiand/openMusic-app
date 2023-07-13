const InvariantError = require('../../exceptions/InvariantError')
const { PlaylistsPayloadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validateResult = PlaylistsPayloadSchema.validate(payload)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
