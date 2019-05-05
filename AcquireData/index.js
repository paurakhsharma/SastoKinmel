const MongoClient = require("mongodb").MongoClient;
const chalk = require('chalk')

// const getAllCategorySastoDeal = require('./sastoDeal_categoryList')

const assert = require("assert");

const SD_getProductList = require('./SD_getProductList')

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "sastoBeforeDB";

// Create a new MongoClient
//const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);
//   const sastoCatList = db.collection('sastoDealCategoryList')

//   sastoCatList.find({name: 'Electronics'}, {"subCategory":true}).toArray( function(err, docs) {
//     docs.map(function(doc) {
//       console.log(doc.subCategory.subSubCategory)
//     })
//     client.close();
//   })
// });
SD_getProductList()