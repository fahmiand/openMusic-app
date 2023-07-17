const PlaylistActivitasHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistActivitas',
  version: '1.0.0',
  register: async (server, { Service }) => {
    const playlistActivitasHandler = new PlaylistActivitasHandler(Service)
    server.route(routes(playlistActivitasHandler))
  }
}
