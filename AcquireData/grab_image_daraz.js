var fs = require('fs')
const download = require('image-downloader')

const dbName = 'sastoBeforeDB'

const Daraz_products_col = 'Daraz_products'

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

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
  const Daraz_products = db.collection(Daraz_products_col)

  const Daraz_products_list = await Daraz_products.find({}).toArray()

  try {
    if (!fs.existsSync('./img')){
        fs.mkdirSync('./img');
    }
  } catch (e) {
    console.log('e', e)
  }

  await asyncForEach(Daraz_products_list, async (Daraz_product, i) => {
      console.log(`${i+1}/${Daraz_products_list.length}`)
    if (!fs.existsSync(`./img/${Daraz_product.subSubCategory}`)){
        fs.mkdirSync(`./img/${Daraz_product.subSubCategory}`);
    }
    console.log('Downaloding', Daraz_product.subSubCategory)
    try {
        options = {
            url: Daraz_product.imageUrl,
            dest: `./img/${Daraz_product.subSubCategory}/${Daraz_product._id}.jpg`
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























// MongoClient.connect(url, function(err, client) {
//   var db = client.db('sastoBeforeDB')

//   var cursor = db.collection(Daraz_products_col).find()
//   var a = 1

//   cursor.each(function(err, doc) {
//     //doc null nahune case
//     if (doc) {
//       //creates folders we have to run this only once....then comment it out-------------------------------------------------
//       //   if (folderTree.includes(doc.subSubCategory)) {
//       //     // console.log('pahille nai xa')
//       //   } else {
//       //     console.log('creating folder number ' + a)
//       //     a++
//       //     // folderTree.push(doc.subSubCategory)
//       //     fs.mkdir('./img/' + doc.subSubCategory, { recursive: true }, err => {
//       //       if (err) throw err
//       //     })
//       //   }

//       //to save data from daraz---------------------------------------

//       options.url = doc.imageUrl
//       options.dest = `img/` + doc.subSubCategory + '/' + doc.name + `.jpg`
//       download
//         .image(options)
//         .then(({ filename, image }) => {
//           console.log('Saved to', filename) // Saved to /path/to/dest/photo.jpg
//         })
//         .catch(err => console.error(err))
//     } else {
//     }
//   })
// })
