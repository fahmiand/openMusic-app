const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postPlaylistSongHandler(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.getPlaylistSongsHandler(request),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.deletePlaylistSongHandler(request),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request) => handler.getPlaylistActivitasHandler(request),
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
