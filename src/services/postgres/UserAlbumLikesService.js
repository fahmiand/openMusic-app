const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class UserAlbumLikesService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addUserAlbumLike (userId, albumId) {
    const id = `like-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal like Album')
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`)
    return result.rows[0].id
  }

  async getUserAlbumLikes (albumId) {
    try {
      const result = await this._cacheService.get(`user_album_likes:${albumId}`)
      return { likes: JSON.parse(result), isCache: 1 }
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const { rows } = await this._pool.query(query)
      await this._cacheService.set(`user_album_likes:${albumId}`, JSON.stringify(rows))

      return { likes: rows }
    }
  }

  async deleteUserAlbumLike (userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal Menghapus Album')
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`)
  }

  async getAlbumLike (albumId) {
    const result = await this._pool.query(`SELECT * FROM albums WHERE id = '${albumId}'`)

    if (!result.rowCount) {
      throw new NotFoundError('Id tidak ditemukan')
    }
  }

  async getAlbumLikes (albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }
    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('Id sudah dilike')
    }
  }
}

module.exports = UserAlbumLikesService
