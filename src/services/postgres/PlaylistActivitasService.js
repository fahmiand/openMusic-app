const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { mapPlaylistActive } = require('../../util')

class PlaylistActivitasService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylistActivitas (playlistId) {
    const result1 = await this._pool.query(`SELECT playlists.id FROM playlists WHERE id = '${playlistId}'`)
    const query = {
      text: `SELECT playlists.id, users.username, songs.title, playlist_song_activities.* FROM playlist_song_activities
      LEFT JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
      LEFT JOIN songs on songs.id = playlist_song_activities.song_id
      LEFT JOIN users ON users.id = playlist_song_activities.user_id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    return mapPlaylistActive(result1.rows[0].id, result.rows)
  }

  async addPlaylistActivitas (playlistId, songId, userId) {
    const id = `active-${nanoid(16)}`
    const time = new Date().toISOString()
    const query = {
      text: 'INSERT INTO playlist_song_activities values($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, 'add', time]
    }
    await this._pool.query(query)
  }

  async addDeletePlaylistActivitas (playlistId, songId, userId) {
    const id = `active-${nanoid(16)}`
    const time = new Date().toISOString()
    const query = {
      text: 'INSERT INTO playlist_song_activities values($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, 'delete', time]
    }
    await this._pool.query(query)
  }
}

module.exports = PlaylistActivitasService
