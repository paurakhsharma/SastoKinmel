const cheerio = require('cheerio')
const fetch = require('node-fetch')
var request = require('sync-request')

const getDaraz_categoriesDB = async Daraz_categories => {
  try {
    return await Daraz_categories.find({}).toArray()
  } catch (err) {
    console.log(err)
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getDaraz_products = async function(
  client,
  dbName,
  Daraz_categories_col_name,
  Daraz_products_col
) {
  const db = client.db(dbName)
  const Daraz_products = db.collection(Daraz_products_col)
  const Daraz_categories_col = db.collection(Daraz_categories_col_name)

  const Daraz_categories = await getDaraz_categoriesDB(Daraz_categories_col)

  await asyncForEach(Daraz_categories, async Daraz_category => {
    let productList = []
    const category = Daraz_category.name
    const subCategory = Daraz_category.subCategory.name
    const subSubCategory = Daraz_category.subCategory.subSubCategory.name
    const subSubCategoryUrl = Daraz_category.subCategory.subSubCategory.url
    const visited = Daraz_category.visited
    const id = Daraz_category._id

    if (!visited) {
      console.log('Scraping', subSubCategory)

      subCategoryUrl = 'https://' + subSubCategoryUrl
      const response = await fetch(new URL(subCategoryUrl))
      const body = await response.text()
      let totalItems = 1
      let pageSize = 1

      const $ = cheerio.load(body)

      const pageScript = $('script')
      pageScript.map((i, script) => {
        script = $(script)
        const scriptString = script.toString()
        if (scriptString.includes('<script>window.pageData=')) {
          const processedString = scriptString
            .replace('<script>window.pageData=', '')
            .replace('</script>', '')
          const scriptJson = JSON.parse(processedString)
          const products = scriptJson['mods']['listItems']
          totalItems = scriptJson['mainInfo']['totalResults']
          pageSize = scriptJson['mainInfo']['pageSize']
          if (products !== undefined) {
            products.forEach(item => {
              productList.push({
                name: item['name'],
                details: JSON.stringify(item['description']),
                imageUrl: item['image'],
                originalPrice: parseInt(item['originalPrice']),
                discountedPrice: parseInt(item['price']),
                category: category,
                subCategory: subCategory,
                subSubCategory: subSubCategory,
                productUrl: item['productUrl'].replace('//', '')
              })
            })

            totalPages = Math.ceil(totalItems / pageSize)
            for (let i = 2; i < totalPages + 1; i++) {
              nextUrl = subCategoryUrl + `?page=${i}`
              console.log(subSubCategory)
              console.log(`Page ${i}/${totalPages + 1}`)
              const next_response = request('GET', new URL(nextUrl))
              const next_body = next_response.getBody()
              const $next = cheerio.load(next_body)

              const next_pageScript = $next('script')
              next_pageScript.map((i, script) => {
                script = $(script)
                const next_scriptString = script.toString()

                if (next_scriptString.includes('<script>window.pageData=')) {
                  const next_processedString = next_scriptString
                    .replace('<script>window.pageData=', '')
                    .replace('</script>', '')
                  const next_scriptJson = JSON.parse(next_processedString)
                  const next_products = next_scriptJson['mods']['listItems']
                  totalItems = next_scriptJson['mainInfo']['totalResults']
                  pageSize = next_scriptJson['mainInfo']['pageSize']
                  if (next_products !== undefined) {
                    next_products.forEach(item => {
                      productList.push({
                        name: item['name'],
                        details: JSON.stringify(item['description']),
                        imageUrl: item['image'],
                        originalPrice: parseInt(item['originalPrice']),
                        discountedPrice: parseInt(item['price']),
                        category: category,
                        subCategory: subCategory,
                        subSubCategory: subSubCategory,
                        productUrl: item['productUrl'].replace('//', '')
                      })
                    })
                  }
                }
              })
            }
          }
        }
      })

      try {
        const count = await Daraz_products.countDocuments()
        try {
          const res = await Daraz_products.insertMany(
            productList
          )
          console.log(res.result)
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
      }
      try {
        await Daraz_categories_col.updateOne(
          { _id: id },
          { $set: { visited: true } }
        )
        console.log('Done')
      } catch (err) {
        console.log(err)
      }
    }
  })
}

module.exports = getDaraz_products
