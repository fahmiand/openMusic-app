const autoBind = require('auto-bind')

class ExportsHandler {
  constructor (playlistsService, service, validator) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService

    autoBind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload)

    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    const { targetEmail } = request.payload

    const message = {
      playlistId,
      targetEmail
    }

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
