var mongoose = require('mongoose')

// Connection URL
const url = 'mongodb://localhost/sastoBeforeDB'

// Create a new MongoClient

exports.GetAllProducts = function(page, limit, callback) {
  mongoose.connect(url, {useNewUrlParser: true});
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    offset = limit * (page - 1)
    db.db.collection('SD_products_col', function (err, collection) {
      if (err) {
        console.error('There was an error', err)
      }
      collection.find({
        category: 'Women'
      })
        .limit(limit)
        .skip(offset)
        .toArray(function (err, data) {
          callback(data)
        })
    })
  });
}
