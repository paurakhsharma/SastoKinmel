const MongoClient = require('mongodb').MongoClient
const chalk = require('chalk')

// const getAllCategorySastoDeal = require('./sastoDeal_categoryList')

const assert = require('assert')

const SD_getProductList = require('./SD_getProductList')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'sastoBeforeDB'

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true })

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err)
  console.log('Connected successfully to server')
  const db = client.db(dbName)

  const SD_getAllCategoriesUrl = function(database, callback) {
    // Get the documents collection
    const SD_categoryList = database.collection('sastoDealCategoryList')
    // Find some documents
    SD_categoryList.find({}).toArray((err, docs) => {
      assert.equal(err, null)
      callback(
        docs.map(doc => {
          return {
            url: doc.subCategory.subSubCategory.url,
            category: doc.name,
            subCategory: doc.subCategory.name,
            subSubCategory: doc.subCategory.subSubCategory.name
          }
        })
      )
    })
  }

  const SD_products = db.collection('SD_products')
  SD_getProductList(url, category, subCategory, subSubCategory).then(
    products => {
      try {
        products.forEach(product => {
          console.log(product)
          if (typeof product === 'undefined') {
            console.log('UNDEFINED DATA')
          } else {
            SD_products.insertOne(product, (err, result) => {
              if (err) {
                console.log('Error is: ', err)
              }
              client.close()
            })
          }
        })
      } catch (err) {
        console.log('error found: ', err)
      }
    }
  )
})
