const Joi = require('joi')

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/png', 'image/jpeg', 'image/webp').required()
}).unknown()

module.exports = { ImageHeadersSchema }
