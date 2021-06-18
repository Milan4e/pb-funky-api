require('dotenv').config()
const db = require('../src/database')
const randomstring = require('randomstring')
const expect = require('chai').expect

describe('user model test', () => {
  const team_id = randomstring.generate()
  const user_id = randomstring.generate()

  const user = {
    user_id,
    team_id,
    access_token: randomstring.generate(),
    token: randomstring.generate(),
  }

  after(async () => {
    await db.User.destroy({ where: { user_id: user.user_id } })
  })

  it('should store user', async () => {
    const dbUser = await db.User.create(user)

    expect(dbUser).not.to.be.null
  })

  it('should update user', async () => {
    await db.User.update({ access_token: 'testing access token' }, { where: { team_id, user_id } })

    const user = await db.User.findOne({
      where: { team_id, user_id }
    })

    expect(user.access_token).to.be.eq('testing access token')
  })
})
