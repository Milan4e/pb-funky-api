require('dotenv').config()
const db = require('../src/database')
const randomstring = require('randomstring')
const expect = require('chai').expect

describe('user model test', () => {
  const user = {
    user_id: randomstring.generate(),
    access_token: randomstring.generate(),
    team_id: randomstring.generate(),
    token: randomstring.generate(),
  }

  after(async () => {
    await db.User.destroy({ where: { user_id: user.user_id } })
  })

  it('should store user', async () => {
    const dbUser = await db.User.create(user)

    expect(dbUser).not.to.be.null
  })
})
