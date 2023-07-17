const autoBind = require('auto-bind')

class PlaylistSongsHandler {
  constructor (playlistsService, playlistsSongsService, playlistSongActivities, validator) {
    this._playlistsService = playlistsService
    this._service = playlistsSongsService
    this._validator = validator
    this._playlistSongActivitas = playlistSongActivities

    autoBind(this)
  }

  async postPlaylistSongHandler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)

    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    const playlistId = await this._service.addPlaylistSong(id, { songId }, credentialId)

    const response = h.response({
      status: 'success',
      message: 'berhasil ditambahkan',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistSongsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const playlist = await this._service.getPlaylistSong(playlistId)

    return {
      status: 'success',
      data: { playlist }
    }
  }

  async deletePlaylistSongHandler (request) {
    await this._validator.validatePlaylistSongPayload(request.payload)
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._service.deletePlaylistSongById(id, { songId }, credentialId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async getPlaylistActivitasHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const activities = await this._playlistSongActivitas.getPlaylistActivitas(playlistId)

    return {
      status: 'success',
      data: activities
    }
  }
}

module.exports = PlaylistSongsHandler
