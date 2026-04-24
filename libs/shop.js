const mongo = require('./mongo')

function collectBodyData(req)
{
    return new Promise((resolve) =>
    {
        let body = ''

        req.on('data', chunk =>
        {
            body += chunk.toString()
        })

        req.on('end', () =>
        {
            try
            {
                resolve(JSON.parse(body))
            }
            catch
            {
                resolve({})
            }
        })
    })
}

async function BuyCompanion(req, resp)
{
    const data = await collectBodyData(req)

    const player_id = Number(data.player_id)
    const item_id = Number(data.item_id)

    if (!player_id || !item_id)
    {
        resp.write(JSON.stringify({
            success: false,
            message: 'player_id หรือ item_id ไม่ถูกต้อง'
        }))
        resp.end()
        return
    }

    const { dbconn, db } = await mongo.connectDB()

    try
    {
        const playerCollection = db.collection('player')
        const shopCollection = db.collection('shop_item')
        const companionCollection = db.collection('companion')
        const playerCompanionCollection = db.collection('player_companion')

        const player = await playerCollection.findOne({ player_id: player_id })

        if (!player)
        {
            resp.write(JSON.stringify({
                success: false,
                message: 'ไม่พบ player'
            }))
            resp.end()
            return
        }

        const shopItem = await shopCollection.findOne({ item_id: item_id })

        if (!shopItem)
        {
            resp.write(JSON.stringify({
                success: false,
                message: 'ไม่พบ item ใน shop'
            }))
            resp.end()
            return
        }

        const companion = await companionCollection.findOne({ item_id: item_id })

        if (!companion)
        {
            resp.write(JSON.stringify({
                success: false,
                message: 'item นี้ไม่ใช่ companion'
            }))
            resp.end()
            return
        }

        const price = Number(shopItem.price)
        const candy = Number(player.candy)

        if (candy < price)
        {
            resp.write(JSON.stringify({
                success: false,
                message: 'candy ไม่พอ'
            }))
            resp.end()
            return
        }

        const alreadyHave = await playerCompanionCollection.findOne({
            player_id: player_id,
            companion_id: companion.companion_id
        })

        if (alreadyHave)
        {
            resp.write(JSON.stringify({
                success: false,
                message: 'มี companion นี้แล้ว'
            }))
            resp.end()
            return
        }

        await playerCollection.updateOne(
            { player_id: player_id },
            { $inc: { candy: -price } }
        )

        await playerCompanionCollection.insertOne({
            player_id: player_id,
            companion_id: companion.companion_id,
            exp: 0,
            is_equipped: "False"
        })

        const updatedPlayer = await playerCollection.findOne({ player_id: player_id })

        resp.write(JSON.stringify({
            success: true,
            message: 'ซื้อสำเร็จ',
            player:
            {
                player_id: updatedPlayer.player_id,
                username: updatedPlayer.username,
                jelly: updatedPlayer.jelly,
                coin: updatedPlayer.coin,
                candy: updatedPlayer.candy
            },
            companion:
            {
                companion_id: companion.companion_id,
                rarity_id: companion.rarity_id,
                reduce_cooking_time: companion.reduce_cooking_time,
                add_waiting_time: companion.add_waiting_time,
                add_bonus_point: companion.add_bonus_point,
                item_id: companion.item_id
            }
        }))

        resp.end()
    }
    catch(err)
    {
        resp.write(JSON.stringify({
            success: false,
            message: err.message
        }))
        resp.end()
    }
    finally
    {
        await dbconn.close()
    }
}

module.exports =
{
    BuyCompanion
}