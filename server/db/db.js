const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = 'mongodb://localhost:27017'

const dbName = 'sastoBeforeDB'
const Daraz_products_col = 'Daraz_products_col'
const SD_products_col = 'SD_products'

let db
let Daraz_products
let SD_products

const setupDB = async function() {
  const client =await  MongoClient.connect(url, { useNewUrlParser: true })
  console.log('client connected')
  if (!client) {
    throw new Exception('could not connect to the database')
  }
  db = client.db(dbName)

  Daraz_products = db.collection(Daraz_products_col)
  SD_products = db.collection(SD_products_col)
}

setupDB()

exports.GetAllProducts = function(page, limit, callback) {
  offset = limit * (page - 1)
  SD_products.find({
    category: 'Women'
  })
    .limit(limit)
    .skip(offset)
    .toArray(function(err, data) {
      callback(data)
    })
}

exports.Search = function(search_param, callback) {
  Daraz_products.find(
    { $text: { $search: search_param } },
    {
      projection: { score: { $meta: 'textScore' } },
      sort: { score: { $meta: 'textScore' } }
    }
  ).toArray(function(err, data) {
    callback(data)
  })
}
