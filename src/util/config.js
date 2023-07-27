// TODO mengimpor dotenv dan melankankonfigurasinya
require('dotenv').config()

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  token: {
    keys: process.env.ACCESS_TOKEN_KEY,
    maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    refresh: process.env.REFRESH_TOKEN_KEY,
    access: process.env.ACCESS_TOKEN_KEY
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER
  },
  redis: {
    host: process.env.REDIS_SERVER
  }

}

module.exports = config
