const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'sastoBeforeDB'

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true })

exports.GetAllProducts = function(callback) {
  client.connect(function(err) {
    assert.equal(null, err)
    console.log('Connected successfully to server')
    const db = client.db(dbName)

    const SD_products = db.collection('SD_products')
    SD_products.find({category: 'Women'}).toArray((err, docs) => {
      assert.equal(err, null)
      callback(docs)
    })
  })
}
