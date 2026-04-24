const http = require('http')
const mongo = require('./libs/mongo')
const auth = require('./libs/auth')
const gacha = require('./libs/gacha') 
const upgrade = require('./libs/upgrade')
const shop = require('./libs/shop')
// ---------------------------------------------------------------
const PORT = process.env.PORT || 9888
// ---------------------------------------------------------------
function onClientRequest(req,resp)
{
    const pathname = req.url.split('?')[0]

    resp.writeHead(200, { 'Content-Type' : 'application/json' })

    if(req.method === 'GET' && pathname === '/api/mongo/companion')
    {
        mongo.Companion(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/currency')
    {
        mongo.Currency(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/item')
    {
        mongo.Item(resp)
        return
    }
     else if(req.method === 'GET' && pathname === '/api/mongo/rarity')
    {
        mongo.Rarity(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/shop_item')
    {
        mongo.ShopItem(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/gacha_item')
    {
        mongo.GachaItem(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/gacha_type')
    {
        mongo.GachaType(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/player')
    {
        mongo.PlayerList(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/player_inventory')
    {
        mongo.PlayerInventory(resp)
        return
    }
    else if(req.method === 'GET' && pathname === '/api/mongo/player_companion')
    {
        mongo.PlayerCompanion(resp)
        return
    }
      else if(req.method === 'GET' && pathname === '/api/mongo/item_type')
    {
        mongo.ItemType(resp)
        return
    }
//----------------------------------------------------------------------------

    else if(req.method === 'POST' && pathname === '/api/auth/signup')
    {
        auth.SignUp(req, resp)
        return
    }
    else if(req.method === 'POST' && pathname === '/api/auth/login')
    {
        auth.Login(req, resp)
        return
    }
    else if(req.method === 'POST' && pathname === '/api/gacha/roll')
    {
        gacha.Roll(req, resp)
        return
    }
    else if(req.method === 'POST' && pathname === '/api/companion/upgrade')
    {
        upgrade.UpgradeCompanion(req, resp)
        return
    }
    else if(req.method === 'POST' && pathname === '/api/shop/buy')
    {
        shop.BuyCompanion(req, resp)
        return
    }

    else
    resp.write(JSON.stringify({messages: [
            'Hello Vercel class [2310511105004 Little Chef - API]',
            'FOR COMPANION [GET = /api/mongo/companion]',
            'FOR CURRENCY [GET = /api/mongo/currency]',
            'FOR ITEM [GET = /api/mongo/item]',
            'FOR RARITY [GET = /api/mongo/rarity]',
            'FOR SHOP ITEM [GET = /api/mongo/shop_item]',
            'FOR GACHA ITEM [GET = /api/mongo/gacha_item]',
            'FOR GACHA TYPE [GET = /api/mongo/gacha_type]',
            'FOR PLAYER COMPANION [GET = /api/mongo/[player_companion]',
            'FOR PLAYER INVENTORY [GET = /api/mongo/player_inventory]',
            'FOR ITEM TYPE [GET = /api/mongo/item_type]',

            'FOR LOG IN [POST = /api/auth/login]',
            'FOR GACHA TYPE [POST = /api/auth/signup]',
            'FOR GACHA ROLL [POST = /api/gacha/roll]',
            'FOR COMPANION UPGRADE [POST = /api/companion/upgrade]',
            'FOR BUY COMPANION  [POST = /api/shop/buy]'

        ]
        }))

    resp.end()
}
// ---------------------------------------------------------------
const server = http.createServer( onClientRequest )
server.listen(PORT)
console.log('running on '+PORT)
