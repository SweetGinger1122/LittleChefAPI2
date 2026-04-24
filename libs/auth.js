const mongo = require('./mongo')

async function collectBodyData(req) {
  return new Promise((resolve) => {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

async function SignUp(req, resp) {
  const body = await collectBodyData(req)
  const { username, password } = body

  if (!username || !password) {
    resp.write(JSON.stringify({
      success: false,
      message: 'Please enter username and password'
    }))
    resp.end()
    return
  }

  const { dbconn, db } = await mongo.connectDB()
  const collection = db.collection('player')

  const exists = await collection.findOne({ username })

  if (exists) {
    resp.write(JSON.stringify({
      success: false,
      message: 'Username already taken!'
    }))
    await dbconn.close()
    resp.end()
    return
  }

  const lastPlayer = await collection
    .find({})
    .sort({ player_id: -1 })
    .limit(1)
    .toArray()

  const nextId = lastPlayer.length > 0 ? lastPlayer[0].player_id + 1 : 250001

  const newPlayer = {
    player_id: nextId,
    username,
    password,
    candy: 0,
    jelly: 0,
    coin: 1500
  }

  await collection.insertOne(newPlayer)

  resp.write(JSON.stringify({
    success: true,
    message: 'Sign Up successful!',
    player: {
      player_id: newPlayer.player_id,
      username: newPlayer.username,
      candy: newPlayer.candy,
      jelly: newPlayer.jelly,
      coin: newPlayer.coin
    }
  }))

  await dbconn.close()
  resp.end()
}

async function Login(req, resp) {
  const body = await collectBodyData(req)
  const { username, password } = body

  if (!username || !password) {
    resp.write(JSON.stringify({
      success: false,
      message: 'Please enter username and password'
    }))
    resp.end()
    return
  }

  const { dbconn, db } = await mongo.connectDB()
  const collection = db.collection('player')

  const player = await collection.findOne({ username, password })

  if (!player) {
    resp.write(JSON.stringify({
      success: false,
      message: 'Incorrect username or password'
    }))

    await dbconn.close()
    resp.end()
    return
  }

  resp.write(JSON.stringify({
    success: true,
    message: 'Login successful',
    player: {
      player_id: player.player_id,
      username: player.username,
      jelly: player.jelly,
      coin: player.coin,
      candy: player.candy
    }
  }))

  await dbconn.close()
  resp.end()
}

module.exports = {
  SignUp,
  Login
}