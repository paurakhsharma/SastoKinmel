var mongoose = require('mongoose')

// Connection URL
const url = 'mongodb://localhost/sastoBeforeDB'

// Create a new MongoClient

exports.GetAllProducts = function(page, limit, callback) {
  mongoose.connect(url, {useNewUrlParser: true});
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    db.db.createIndex( { name: "text", detail: "text" } )
    offset = limit * (page - 1)
    db.db.collection('SD_products', function (err, collection) {
      if (err) {
        console.error('There was an error', err)
      }
      collection.find({
        category: 'Women'
      })
        .limit(limit)
        .skip(offset)
        .toArray(function (err, data) {
          mongoose.disconnect()
          callback(data)
        })
    })
  });
}

exports.Search = function(search_param, callback) {
  mongoose.connect(url, {useNewUrlParser: true})
  const db = mongoose.connection
  db.on('err', console.error.bind(console, 'connection error:'))

  db.once('open', function () {
    db.db.collection('Daraz_products_col', function (err, collection) {
      if (err) {
        console.error('There was an error', err)
      }
      console.log(search_param)
      collection.find({ $text: {$search: search_param}})
        .toArray(function (err, data) {
          mongoose.disconnect()
          callback(data)
        })
    })
  })
}
