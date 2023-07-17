// TODO mengimpor dotenv dan melankankonfigurasinya
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// ? songs
const songs = require('./api/songs/index')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

// ? albums
const albums = require('./api/album/index')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

// ? Users
const users = require('./api/users/index')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// ? Authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// ? Playlists
const playlists = require('./api/playlists/index')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

// ? playlistSong
const playlistsongs = require('./api/playlistsong/index')
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService')
const PlaylistSongsValidator = require('./validator/playlistsong')

// ? Collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// ? PlaylistActivities
const PlaylistActivitasService = require('./services/postgres/PlaylistActivitasService')

// ! costumer Error
const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const playlistActivities = new PlaylistActivitasService()
  const collaborationsService = new CollaborationsService()
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const playlistsService = new PlaylistsService(collaborationsService)
  const playlistSongsService = new PlaylistSongsService(playlistActivities)

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // ? registrasi plugin eksterna;
  await server.register([
    {
      plugin: Jwt
    }
  ])

  //* mendefinisikan strategi autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsService,
        playlistSongsService,
        playlistActivities,
        validator: PlaylistSongsValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue
      }
      // penanganan server error sesuai kebutuhan
      console.log(response.message)
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
