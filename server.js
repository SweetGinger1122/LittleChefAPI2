const http = require('http')
const mongo = require('./libs/mongo')
// ---------------------------------------------------------------
const PORT = process.env.PORT || 9888
// ---------------------------------------------------------------
function onClientRequest(req,resp)
{
    const pathname = req.url.split('?')[0]

    resp.writeHead(200, { 'Content-Type' : 'application/json' })

    if(req.method === 'GET' && pathname === '/api/mongo/companion')
    {
        mongo.Comapnion(resp)
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
        mongo.Item(resp)
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


    else
    resp.write(JSON.stringify({messages: [
            'Hello Vercel class [2310511105004 Little Chef - API]',
            'FOR COMPANION [GET = /api/mongo/companion]',
            'FOR CURRENCY [GET = /api/mongo/currency]',
            'FOR ITEM [GET = /api/mongo/item]',
            'FOR RARITY [GET = /api/mongo/rarity]',
            'FOR SHOP ITEM [GET = /api/mongo/shop_item]',
            'FOR GACHA ITEM [GET = /api/mongo/gacha_item]',
            'FOR GACHA TYPE [GET = /api/mongo/gacha_type]'

        ]
        }))

    resp.end()
}
// ---------------------------------------------------------------
const server = http.createServer( onClientRequest )
server.listen(PORT)
console.log('running on '+PORT)
