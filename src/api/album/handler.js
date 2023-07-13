const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload

    const albumId = await this._service.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Berhasil Ditambahkan!',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)
    const songs = await this._service.getSongJoinAlbumById(id)
    const detailJoinAlbum = { ...album, songs }

    return {
      status: 'success',
      data: {
        album: detailJoinAlbum
      }
    }
  }

  async putAlbumByIdHandler (request) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)
    return {
      status: 'success',
      message: 'Album Berhasil Diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Album Berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
