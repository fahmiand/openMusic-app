const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class CollaborationsService {
  constructor () {
    this._pool = new Pool()
  }

  async addCollaboration (playlistId, { userId }) {
    const id = `collab-${nanoid(16)}`

    const users = await (await this._pool.query(`SELECT * FROM users WHERE id = '${userId}'`)).rowCount

    if (!users) {
      throw new NotFoundError('User Id tidak ada')
    }

    const Playlists = await (await this._pool.query(`SELECT * FROM playlists WHERE id = '${playlistId}'`)).rowCount

    if (!Playlists) {
      throw new NotFoundError('Playlits Id tidak ada')
    }

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('kollaborati gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async deleteCollaboration (playlistId, userId) {
    const users = await (await this._pool.query(`SELECT * FROM users WHERE id = '${userId}'`)).rowCount

    if (!users) {
      throw new NotFoundError('User Id tidak ada')
    }

    const collaborations = await (await this._pool.query(`SELECT * FROM collaborations WHERE user_id = '${userId}'`)).rowCount

    if (!collaborations) {
      throw new NotFoundError('User Id tidak ada')
    }

    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Kollaborasi gagal dihpus')
    }
  }

  async verifyCollaborator (playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('kolaborasi gagal diverifikasi')
    }
  }
}

module.exports = CollaborationsService
