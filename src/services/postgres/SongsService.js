const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { mapDBToModel } = require('../../util')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `songs-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan songs!')
    }
    return result.rows[0].id
  }

  async getSongs (title, performer) {
    let result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    )

    if (title !== undefined) {
      result = await this._pool.query(
        `SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE '%${title}%'`
      )
    }

    if (performer !== undefined) {
      result = await this._pool.query(
        `SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE '%${performer}%'`
      )
    }

    return result.rows.map(mapDBToModel)
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal mendapatkan music, Id tidak ditemukan!')
    }

    return result.rows[0]
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan!')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Songs gagal dihapus, Id tidak ditemukan!')
    }
  }
}

module.exports = SongsService
