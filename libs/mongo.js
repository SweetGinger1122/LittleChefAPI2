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

module.exports = 
{
                    Comapnion : runMongoCompanion,
                    Currency : runMongoCurrency,
                    Item : runMongoItem,
                    Rarity : runMongoRarity,
                    ShopItem : runMongoShopItem

};

