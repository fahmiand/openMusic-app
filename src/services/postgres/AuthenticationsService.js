const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class AuthenticationsService {
  constructor () {
    this._pool = new Pool()
  }

  async addRefreshToken (token) {
    await this._pool.query(`INSERT INTO authentications values('${token}')`)
  }

  async verifyRefreshToken (token) {
    const result = await this._pool.query(`SELECT token FROM authentications WHERE token = '${token}'`)

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }

  async deleteRefreshToken (token) {
    await this._pool.query(`DELETE FROM authentications WHERE token = '${token}'`)
  }
}

module.exports = AuthenticationsService
