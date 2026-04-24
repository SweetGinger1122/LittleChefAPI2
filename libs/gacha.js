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

function toNumber(value) {
  return Number(value)
}

function mapItemType(typeId) {
  const id = toNumber(typeId)

  if (id === 11001) return 'utility'
  if (id === 11002) return 'decoration'
  if (id === 11003) return 'companion'
  if (id === 11004) return 'currency'

  return 'unknown'
}

function getCandyByRarity(rarityName) {
  if (rarityName === 'R') return 200
  if (rarityName === 'S') return 80
  if (rarityName === 'A') return 30
  if (rarityName === 'B') return 10
  if (rarityName === 'C') return 3

  return 0
}

function randomItem(pool) {
  let totalRate = 0

  for (const item of pool) {
    totalRate += toNumber(item.drop_rate)
  }

  let rand = Math.random() * totalRate
  let current = 0

  for (const item of pool) {
    current += toNumber(item.drop_rate)

    if (rand <= current) {
      return item
    }
  }

  return pool[pool.length - 1]
}

async function findByNumberOrString(collection, fieldName, value) {
  const numberValue = toNumber(value)
  const stringValue = String(value)

  return await collection.findOne({
    $or: [
      { [fieldName]: numberValue },
      { [fieldName]: stringValue }
    ]
  })
}

async function addOrUpdateInventory(db, playerId, itemId) {
  const collection = db.collection('player_inventory')

  const pid = toNumber(playerId)
  const iid = toNumber(itemId)

  const exists = await collection.findOne({
    $or: [
      { player_id: pid, item_id: iid },
      { player_id: String(pid), item_id: String(iid) }
    ]
  })

  if (exists) {
    await collection.updateOne(
      { _id: exists._id },
      { $inc: { quantity: 1 } }
    )
  } else {
    await collection.insertOne({
      player_id: pid,
      item_id: iid,
      quantity: 1
    })
  }
}

async function handleReward(db, playerId, reward) {
  const pid = toNumber(playerId)
  const itemId = toNumber(reward.item_id)
  const itemType = mapItemType(reward.item_type_id)

  const result = {
    item_id: itemId,
    item_name: reward.item_name,
    item_type: itemType,
    rarity: reward.rarity_name || '',
    is_duplicate: false,
    candy_received: 0
  }

  console.log('REWARD DEBUG:', result)

  if (itemType === 'companion') {
    const companion = await findByNumberOrString(
      db.collection('companion'),
      'item_id',
      itemId
    )

    if (!companion) {
      result.message = 'Companion data not found'
      return result
    }

    const companionId = toNumber(companion.companion_id)

    const owned = await db.collection('player_companion').findOne({
      $or: [
        { player_id: pid, companion_id: companionId },
        { player_id: String(pid), companion_id: String(companionId) }
      ]
    })

    if (owned) {
      const candy = getCandyByRarity(result.rarity)

      if (candy > 0) {
        await db.collection('player').updateOne(
          { player_id: pid },
          { $inc: { candy: candy } }
        )
      }

      result.is_duplicate = true
      result.candy_received = candy
    } else {
      await db.collection('player_companion').insertOne({
        player_id: pid,
        companion_id: companionId,
        exp: 0,
        is_equipped: 'False'
      })
    }
  }

  else if (itemType === 'utility') {
    await addOrUpdateInventory(db, pid, itemId)
  }

  else if (itemType === 'decoration') {
    await addOrUpdateInventory(db, pid, itemId)
  }

  else if (itemType === 'currency') {
    if (itemId === 12007) {
      await db.collection('player').updateOne(
        { player_id: pid },
        { $inc: { coin: 100 } }
      )
    }

    else if (itemId === 12008) {
      await db.collection('player').updateOne(
        { player_id: pid },
        { $inc: { candy: 60 } }
      )
    }
  }

  return result
}

async function buildGachaPool(db, gachaId) {
  const gid = toNumber(gachaId)

  const gachaItems = await db.collection('gacha_item').find({
    $or: [
      { gacha_id: gid },
      { gacha_id: String(gid) }
    ]
  }).toArray()

  const pool = []

  for (const g of gachaItems) {
    const item = await findByNumberOrString(
      db.collection('item'),
      'item_id',
      g.item_id
    )

    if (!item) continue

    let rarityName = ''

    if (toNumber(item.item_type_id) === 11003) {
      const companion = await findByNumberOrString(
        db.collection('companion'),
        'item_id',
        item.item_id
      )

      if (companion) {
        const rarity = await findByNumberOrString(
          db.collection('rarity'),
          'rarity_id',
          companion.rarity_id
        )

        if (rarity) {
          rarityName = rarity.rarity_name
        }
      }
    }

    pool.push({
      item_id: toNumber(item.item_id),
      item_name: item.item_name,
      item_type_id: toNumber(item.item_type_id),
      rarity_name: rarityName,
      drop_rate: toNumber(g.drop_rate)
    })
  }

  return pool
}

async function getGachaPrice(db, gachaId) {
  const gid = toNumber(gachaId)

  const gacha = await findByNumberOrString(
    db.collection('gacha'),
    'gacha_id',
    gid
  )

  if (!gacha) {
    if (gid === 18001) return 500
    return 1000
  }

  return toNumber(gacha.jelly_price)
}

async function Roll(req, resp) {
  const body = await collectBodyData(req)

  const playerId = toNumber(body.player_id)
  const gachaId = toNumber(body.gacha_id)
  const rollCount = toNumber(body.roll_count)

  if (!playerId || !gachaId || !rollCount) {
    resp.write(JSON.stringify({
      success: false,
      message: 'Missing player_id, gacha_id or roll_count'
    }))
    resp.end()
    return
  }

  if (rollCount !== 1 && rollCount !== 10) {
    resp.write(JSON.stringify({
      success: false,
      message: 'roll_count must be 1 or 10'
    }))
    resp.end()
    return
  }

  const { dbconn, db } = await mongo.connectDB()

  try {
    const player = await findByNumberOrString(
      db.collection('player'),
      'player_id',
      playerId
    )

    if (!player) {
      resp.write(JSON.stringify({
        success: false,
        message: 'Player not found'
      }))
      await dbconn.close()
      resp.end()
      return
    }

    const jellyCost = await getGachaPrice(db, gachaId)
    const totalCost = jellyCost * rollCount

    if (toNumber(player.jelly) < totalCost) {
      resp.write(JSON.stringify({
        success: false,
        message: 'Jelly not enough',
        current_jelly: player.jelly,
        need_jelly: totalCost
      }))
      await dbconn.close()
      resp.end()
      return
    }

    const pool = await buildGachaPool(db, gachaId)

    if (pool.length === 0) {
      resp.write(JSON.stringify({
        success: false,
        message: 'Gacha item pool is empty or invalid'
      }))
      await dbconn.close()
      resp.end()
      return
    }

    await db.collection('player').updateOne(
      { _id: player._id },
      { $inc: { jelly: -totalCost } }
    )

    const results = []

    for (let i = 0; i < rollCount; i++) {
      const reward = randomItem(pool)
      const finalReward = await handleReward(db, playerId, reward)
      results.push(finalReward)
    }

    const updatedPlayer = await findByNumberOrString(
      db.collection('player'),
      'player_id',
      playerId
    )

    resp.write(JSON.stringify({
      success: true,
      message: 'Roll success',
      player: {
        player_id: toNumber(updatedPlayer.player_id),
        username: updatedPlayer.username,
        jelly: updatedPlayer.jelly,
        coin: updatedPlayer.coin,
        candy: updatedPlayer.candy
      },
      results: results
    }))

    await dbconn.close()
    resp.end()
  } catch (err) {
    console.log(err)

    resp.write(JSON.stringify({
      success: false,
      message: 'Server error',
      error: err.message
    }))

    await dbconn.close()
    resp.end()
  }
}

module.exports = {
  Roll
}