const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = 'mongodb://localhost:27017'

const dbName = 'sastoBeforeDB'
const combined_products_col = 'combined_products'

let db

const setupDB = async function() {
  const client =await  MongoClient.connect(url, { useNewUrlParser: true })
  console.log('client connected')
  if (!client) {
    throw new Exception('could not connect to the database')
  }
  db = client.db(dbName)

  combined_products = db.collection(combined_products_col)
}

setupDB()

exports.GetAllProducts = function(page, limit, callback) {
  offset = limit * (page - 1)
  combined_products.find({
    category: 'Women'
  })
    .limit(limit)
    .skip(offset)
    .toArray(function(err, data) {
      callback(data)
    })
}

exports.Search = function(search_param, callback) {
  combined_products.find(
    { $text: { $search: search_param } },
    {
      projection: { score: { $meta: 'textScore' } },
      score: { $meta: 'textScore' }
    }
  ).sort({score: { $meta:"textScore"}, discountedPrice: 1}).toArray(function(err, data) {
    console.log(data)
    console.log(err)
    callback(data)
  })
}


/**
 * db.combined_products.createIndex(
  {
    name: "text",
    subSubCategory: "text",
  },
  {
    weights: {
      name: 5,
      subSubCategory: 10,
    },
    name: "name_details_category_index"
  }
)

db.combined_products.createIndex(
  { discountedPrice: -1}
)
 */