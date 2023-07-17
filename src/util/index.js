const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner,
  playlist_id,
  song_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner,
  playlistId: playlist_id,
  songId: song_id
})

const mapPlaylistActive = (playlistData, active) => ({
  playlistId: playlistData,
  activities: active
})
module.exports = { mapDBToModel, mapPlaylistActive }
