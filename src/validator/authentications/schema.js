const Joi = require('joi')

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const PutAuthenticatioanPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticatioanPayloadSchema,
  DeleteAuthenticationPayloadSchema
}
