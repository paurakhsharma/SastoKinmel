const cheerio = require('cheerio')
const fetch = require('node-fetch')

module.exports = async function({subCategory, category, subCategoryUrl}) {
  subCategoryUrl = 'https://' + subCategoryUrl
  console.log('Category:', category, 'subCategory', subCategory)
  const response = await fetch(new URL(subCategoryUrl))
  const body = await response.text()
  let totalItems = 1
  let pageSize = 1

  const $ = cheerio.load(body)

  const pageScript = $('script')
  await pageScript
    .each(async (i, script) => {
      script = $(script)
      const scriptString = script.toString()
      if (scriptString.includes('<script>window.pageData=')) {
        const processedString = scriptString.replace('<script>window.pageData=', '').replace('</script>', '')
        const scriptJson = JSON.parse(processedString)
        const products = scriptJson['mods']['listItems']
        totalItems = scriptJson['mainInfo']['totalResults']
        pageSize = scriptJson['mainInfo']['pageSize']
        console.log('Page: ', 1)
        client.connect(async function(err) {
          const ProductsInFirstPage = []
          await products.forEach(item => {
            ProductsInFirstPage.push({
              category: category,
              details: JSON.stringify(item['description']),
              discountedPrice: parseInt(item['price']),
              imageUrl: item['image'],
              name: item['name'],
              originalPrice: parseInt(item['originalPrice']),
              subCategory: subCategory
            })
          })

          const db = await client.db(dbName)
          const darazProductsColl = await db.collection('darazProductsList')

          await darazProductsColl
            .insertMany(ProductsInFirstPage, (err, result) => {
              if (err) {
                console.log('There was an error', err)
              }
              console.log(result.insertedCount)
            })

          totalPages = Math.ceil(totalItems / pageSize)
          for(let i=2; i<totalPages+1; i++) {
            setTimeout(async () => {
              nextUrl = subCategoryUrl + `?page=${i}`

            console.log(nextUrl)
            console.log('Page: ', i)
            const next_response = await fetch(new URL(nextUrl))
            const next_body = await next_response.text()
            console.log(next_body)
            const $next = cheerio.load(next_body)

            const next_pageScript = $next('script')
            next_pageScript
              .each(async (i, script) => {
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

                  const ProductsInNextPage = []
                  next_products.forEach(item => {
                    ProductsInNextPage.push({
                      category: category,
                      details: JSON.stringify(item['description']),
                      discountedPrice: parseInt(item['price']),
                      imageUrl: item['image'],
                      name: item['name'],
                      originalPrice: parseInt(item['originalPrice']),
                      subCategory: subCategory
                    })
                  })

                  await darazProductsColl
                    .insertMany(ProductsInNextPage, (err, result) => {
                      if (err) {
                        console.log('There was an error', err)
                      }
                      console.log(result.insertedCount)
                    })
                }
              })
            }, 2000*i)
          }
        })
        console.log('Done')
      }
    })
}
