class UserAlbumLikesHandler {
  constructor (service) {
    this._service = service
  }

  async postUserAlbumLikeHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id } = request.params

    await this._service.getAlbumLike(id)
    await this._service.getAlbumLikes(id, credentialId)

    await this._service.addUserAlbumLike(credentialId, id)

    const response = h.response({
      status: 'success',
      message: 'Berhasil ditambahkan'
    })
    response.code(201)
    return response
  }

  async getUserAlbumLikeHandler (request, h) {
    const { id } = request.params

    const { likes, isCache = 0 } = await this._service.getUserAlbumLikes(id)

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length
      }
    })
    response.code(200)
    if (isCache) response.header('X-Data-Source', 'cache')
    return response
  }

  async deleteUserAlbumLikeHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.deleteUserAlbumLike(credentialId, id)
    return {
      status: 'success',
      message: 'batal Like album'
    }
  }
}

module.exports = UserAlbumLikesHandler
