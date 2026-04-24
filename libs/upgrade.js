const mongo = require('./mongo')

function getLevel(exp) {
    let level = Math.floor(Number(exp || 0) / 1000) + 1

    if (level < 1) level = 1
    if (level > 5) level = 5

    return level
}

function getUpgradeCost(level) {
    return (level + 1) * 1000
}

function calculateOneStat(baseStat, level) {
    const base = Number(baseStat || 0)

    if (base === 0) {
        return 0
    }

    return base + ((level - 1) * 2)
}

function calculateStats(companion, level) {
    return {
        reduce_cooking_time: calculateOneStat(companion.reduce_cooking_time, level),
        add_waiting_time: calculateOneStat(companion.add_waiting_time, level),
        add_bonus_point: calculateOneStat(companion.add_bonus_point, level)
    }
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = ''

        req.on('data', chunk => {
            body += chunk
        })

        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch (err) {
                reject(err)
            }
        })
    })
}

async function UpgradeCompanion(req, resp) {
    let dbconn = null

    try {
        const data = await readBody(req)

        const player_id = Number(data.player_id)
        const companion_id = Number(data.companion_id)

        if (!player_id || !companion_id) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Missing player_id or companion_id'
            }))
            return
        }

        const result = await mongo.connectDB()
        dbconn = result.dbconn
        const db = result.db

        const playerCol = db.collection('player')
        const companionCol = db.collection('companion')
        const playerCompanionCol = db.collection('player_companion')

        const player = await playerCol.findOne({ player_id: player_id })

        if (!player) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Player not found'
            }))
            return
        }

        const companion = await companionCol.findOne({
            companion_id: companion_id
        })

        if (!companion) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Companion not found'
            }))
            return
        }

        const playerCompanion = await playerCompanionCol.findOne({
            player_id: player_id,
            companion_id: companion_id
        })

        if (!playerCompanion) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Player does not own this companion'
            }))
            return
        }

        const currentExp = Number(playerCompanion.exp || 0)
        const currentLevel = getLevel(currentExp)

        if (currentLevel >= 5) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Companion already max level',
                player_id: player_id,
                companion_id: companion_id,
                coin: Number(player.coin || 0),
                level: currentLevel,
                exp: currentExp,
                stats: calculateStats(companion, currentLevel)
            }))
            return
        }

        const cost = getUpgradeCost(currentLevel)
        const playerCoin = Number(player.coin || 0)

        if (playerCoin < cost) {
            resp.end(JSON.stringify({
                success: false,
                message: 'Not enough coin',
                player_id: player_id,
                companion_id: companion_id,
                coin: playerCoin,
                cost: cost,
                level: currentLevel,
                exp: currentExp,
                stats: calculateStats(companion, currentLevel)
            }))
            return
        }

        const newCoin = playerCoin - cost
        const newExp = currentExp + 1000
        const newLevel = getLevel(newExp)
        const newStats = calculateStats(companion, newLevel)

        await playerCol.updateOne(
            { player_id: player_id },
            {
                $set: {
                    coin: newCoin
                }
            }
        )

        await playerCompanionCol.updateOne(
            {
                player_id: player_id,
                companion_id: companion_id
            },
            {
                $set: {
                    exp: newExp
                }
            }
        )

        resp.end(JSON.stringify({
            success: true,
            message: 'Upgrade success',
            player_id: player_id,
            companion_id: companion_id,
            coin: newCoin,
            cost: cost,
            old_level: currentLevel,
            level: newLevel,
            exp: newExp,
            stats: newStats
        }))
    }
    catch (err) {
        console.error(err)

        resp.end(JSON.stringify({
            success: false,
            message: 'Server error',
            error: err.message
        }))
    }
    finally {
        if (dbconn) {
            await dbconn.close()
        }
    }
}

module.exports = {
    UpgradeCompanion
}