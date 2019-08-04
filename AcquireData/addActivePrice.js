var fs = require('fs')
const download = require('image-downloader')

const dbName = 'sastoBeforeDB'

const Daraz_products_col = 'combined_products'

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

let count = 1
async function downloadImages() {
  console.log('Downloading image')
  // Create a new MongoClient
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  if (!client) {
    throw new Exception('could not connect to the database')
  }

  const db = client.db(dbName)
  const Daraz_products = db.collection(Daraz_products_col)

  const Daraz_products_list = await Daraz_products.find({}).toArray()

  await asyncForEach(Daraz_products_list, async (element, i) => {
    if (element.discountedPrice === '') {
      await Daraz_products.updateOne(
        { _id: element._id },
        { $set: { activePrice: element.originalPrice } }
      )
    } else {
      await Daraz_products.updateOne(
        { _id: element._id },
        { $set: { activePrice: element.discountedPrice } }
      )
    }
  })
  await client.close()
}

downloadImages()