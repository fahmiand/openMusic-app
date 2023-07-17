const routes = require('./routes')
const PlaylistSongsHandler = require('./handler')

module.exports = {
  name: 'playlistsong',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongsService, playlistActivities, validator }) => {
    const playlistsongsHandler = new PlaylistSongsHandler(playlistsService, playlistSongsService, playlistActivities, validator)
    server.route(routes(playlistsongsHandler))
  }
}
