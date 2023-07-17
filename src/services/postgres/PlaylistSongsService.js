const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistSongsService {
  constructor (playlistSongActivitas) {
    this._pool = new Pool()
    this._playlistSongActivitas = playlistSongActivitas
  }

  async addPlaylistSong (playlistId, { songId }, credentialId) {
    const id = `playlistsong-${nanoid(16)}`

    const resultSongs = await this._pool.query(`select * from songs where id = '${songId}'`)

    if (!resultSongs.rowCount) {
      throw new NotFoundError('Song Id tidak ditemukan')
    }
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan playlistsong')
    }

    await this._playlistSongActivitas.addPlaylistActivitas(playlistId, songId, credentialId)

    return result.rows[0].id
  }

  async getPlaylistSong (id) {
    const query1 = {
      text: `SELECT playlists.id, name, users.username FROM playlists
              INNER JOIN users ON playlists.owner = users.id
              WHERE playlists.id = $1`,
      values: [id]
    }

    const query2 = {
      text: `SELECT songs.id, title, performer FROM songs
              LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
              WHERE playlistsongs.playlist_id = $1`,
      values: [id]
    }
    const result1 = await this._pool.query(query1)
    const result2 = await this._pool.query(query2)

    const combin = {
      ...result1.rows[0],
      songs: [...result2.rows]
    }
    return combin
  }

  async deletePlaylistSongById (playlistId, { songId }, credentialId) {
    const playlist = await this._pool.query(`select * from playlists where id = '${playlistId}'`)

    if (!playlist.rowCount) {
      throw new NotFoundError('Song Id tidak ditemukan')
    }
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)
    await this._playlistSongActivitas.addDeletePlaylistActivitas(playlistId, songId, credentialId)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus playlistsong')
    }
  }
}

module.exports = PlaylistSongsService
