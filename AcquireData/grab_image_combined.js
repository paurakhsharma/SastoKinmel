var fs = require('fs')
const download = require('image-downloader')

const dbName = 'sastoBeforeDB'

const products_col = 'combined_col'

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

var folderTree = []

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function downloadImages() {
  console.log('Downloading image')
  // Create a new MongoClient
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  if (!client) {
    throw new Exception('could not connect to the database')
  }

  const db = client.db(dbName)
  const products = db.collection(products_col)

  const products_list = await products.find({}).toArray()

  try {
    if (!fs.existsSync('./img')){
        fs.mkdirSync('./img');
    }
  } catch (e) {
    console.log('e', e)
  }

  await asyncForEach(products_list, async (product, i) => {
      console.log(`${i+1}/${products_list.length}`)
      var folderToBeMade=product.subSubCategory.replace('/','-')
    if (!fs.existsSync(`./img/${folderToBeMade}`)){
        fs.mkdirSync(`./img/${folderToBeMade}`);
    }
    try {
      var foldername=product.subSubCategory.replace('/','-')
        options = {
            
            url: product.imageUrl,
            dest: `./img/${foldername}/${product._id}.jpg`
        }
        await download.image(options)
      } catch (e) {
        console.error(e)
      }
  })
  await client.close()
  console.log('Done downloading')
}

downloadImages()
