const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner
})

const mapPlaylistActive = (playlistData, active) => ({
  playlistId: playlistData,
  activities: active
})
module.exports = { mapDBToModel, mapPlaylistActive }
