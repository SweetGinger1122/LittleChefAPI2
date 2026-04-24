const { MongoClient }   = require('mongodb')
const dns               = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const   db_protocol     = `mongodb+srv://`,
            db_path         = ``,
            db_host         = `cluster0.k5dqkqd.mongodb.net`,  
            db_port         = ``,    
            db_url          = db_protocol+db_host+db_port+db_path
let authuser = 
{
                    username: `admin_db`, 
                    password: `RWepduGuku5NzalE`
}
let options = 
{            
                    auth: authuser ,
           authMechanism: `SCRAM-SHA-1`
}

async function runMongoCompanion(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('companion')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoCurrency(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('currency')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoItem(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('item')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}
async function runMongoItemType(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('item_type')

  const data = await collection.find({}).toArray()

  const result = data.map(x => ({
    item_type_id: x.item_type_id,
    item_type_name: x.item_type_name,
    can_keep_in_inventory: x.can_keep_in_inventory ? "True" : "False"
  }))

  console.log(result)

  resp.write(JSON.stringify(result))
  await dbconn.close()

  resp.end()
}

async function runMongoRarity(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('rarity')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoShopItem(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('shop_item')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoGachaItem(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('gacha_item')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoGachaType(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('gacha_type')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoPlayerList(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('player')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}
async function runMongoPlayerInventory(resp)
{
  const dbconn = await MongoClient.connect(db_url, options);
  const db = dbconn.db('game_db')
 
  console.log('Connected to MongoDB')

  const collection = db.collection('player_inventory')

  const insertResult = await collection.find({}).toArray()
  console.log( insertResult )

  const findResult = await collection.find({}).toArray()
  resp.write(JSON.stringify(findResult))
  await dbconn.close()

  resp.end()
}

async function runMongoPlayerCompanion(resp)
{
    const dbconn = await MongoClient.connect(db_url, options);
    const db = dbconn.db('game_db');

    const collection = db.collection('player_companion');

    const data = await collection.find({}).toArray();

    const result = data.map(x => ({
        player_id: Number(x.player_id),
        companion_id: Number(x.companion_id),
        exp: Number(x.exp || 0),
        is_equipped: x.is_equipped === "True" ? "True" : "False"
    }));

    resp.write(JSON.stringify(result));

    await dbconn.close();
    resp.end();
}

async function connectDB()
{
  const dbconn = await MongoClient.connect(db_url, options)
  const db = dbconn.db('game_db')

  console.log('Connected to MongoDB')

  return { dbconn, db }
}


module.exports = 
{
                    connectDB : connectDB,
                    Companion : runMongoCompanion,
                    Currency : runMongoCurrency,
                    Item : runMongoItem,
                    ItemType : runMongoItemType,
                    Rarity : runMongoRarity,
                    ShopItem : runMongoShopItem,
                    GachaItem : runMongoGachaItem,
                    GachaType : runMongoGachaType,
                    PlayerList : runMongoPlayerList,
                    PlayerInventory : runMongoPlayerInventory,
                    PlayerCompanion : runMongoPlayerCompanion,
                    

};

