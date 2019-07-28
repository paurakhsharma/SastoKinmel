const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const getSD_categories = require('./sastoDeal_categoryList')
const getSD_products = require('./SD_getProductList')

const getDaraz_categories = require('./Daraz_categoryList')
const getDaraz_products = require('./Daraz_getProductList')

// Connection URL
const url = 'mongodb://localhost:27017'
const dbName = 'sastoBeforeDB'
const SD_categories_col = 'SD_cat_col'
const SD_products_col = 'SD_products_col'

const Daraz_categories_col = 'Daraz_cat_col'
const Daraz_products_col = 'Daraz_products_col'

async function getClient() {
  // Create a new MongoClient
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  if (!client) {
    throw new Exception('could not connect to the database')
  }
  return client
}

module.exports.SD_categories =  async () => {
  const client = await getClient()

  await getSD_categories(client, dbName, SD_categories_col)

  await client.close()
}

module.exports.SD_products = async () => {
  const client = await getClient()

  await getSD_products(client, dbName, SD_categories_col, SD_products_col)

  await client.close()
}

module.exports.Daraz_categories = async () => {
  const client = await getClient()

  await getDaraz_categories(client, dbName, Daraz_categories_col)

  await client.close()
}

module.exports.Daraz_products = async () => {
  const client = await getClient()

  await getDaraz_products(client, dbName, Daraz_categories_col, Daraz_products_col)

  await client.close()
}