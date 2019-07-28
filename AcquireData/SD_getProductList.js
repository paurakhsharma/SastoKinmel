const cheerio = require('cheerio')
const fetch = require('node-fetch')

const getSD_categoriesDB = async (SD_categories) => {
  try {
    return await SD_categories.find({}).toArray()
  } catch (err) {
    console.log(err)
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const getSD_products =  async (client, dbName, SD_categories_col_name, SD_products_col) => {
  const db = client.db(dbName)
  const SD_products = db.collection(SD_products_col)
  const SD_categories_col = db.collection(SD_categories_col_name)

  const SD_categories = await getSD_categoriesDB(SD_categories_col)


  await asyncForEach(SD_categories, async (SD_category) => {
    let productUrlList = []
    const category = SD_category.name
    const subCategory = SD_category.subCategory.name
    const subSubCategory = SD_category.subCategory.subSubCategory.name
    const subSubCategoryUrl = SD_category.subCategory.subSubCategory.url
    const visited = SD_category.visited
    const id = SD_category._id

    console.log(subSubCategory)

    console.log(visited)
    if (!visited) {
      BASE_URL = 'https://www.sastodeal.com'
      CAT_URL = BASE_URL + subSubCategoryUrl
      URL_WITH_RANGE = CAT_URL + '?flag=setFilters&toRange='

      const response = await fetch(new URL(CAT_URL))
      const body = await response.text()

      const $ = cheerio.load(body)
      /* get the total number of products in the category,
        this is required because initially the page loads only
        some of the items but we need to get all the products
        in the category. */
      const totalProductCount = $('#countOfProduct').attr('value')
      console.log(totalProductCount)

      // hera all represent all the products in the category
      const responseAll = await fetch(new URL(URL_WITH_RANGE + totalProductCount))
      const bodyAll = await responseAll.text()
      const $all = cheerio.load(bodyAll)

      $all('.categoryProduct').each((i, product) => {
        const $product = $all(product)
        // get the product url
        productUrl = BASE_URL + $product.find('a').attr('href')
        productUrlList.push(productUrl)
      })
      await asyncForEach(productUrlList, async (productUrl, index) => {
        console.log('Start scraping', productUrl)
        console.log(`Scraping ${index+1}/${productUrlList.length}`)
        const productDetails = await getProductDetail(productUrl, category, subCategory, subSubCategory)
        try {
          const count = await SD_products.countDocuments()
          try {
            const res = await SD_products.insertOne(productDetails)
          } catch (err) {
            console.log(err)
          }
        } catch (err) {
          console.log(err)
          }
      })
      await SD_categories_col.updateOne({_id: id}, {$set: {visited: true}})
    }
  })
}

/**
 * Get the details of each product
 *
 * @param {string} url
 *
 */
async function getProductDetail(
  productUrl,
  category,
  subCategory,
  subSubCategory
) {
  try {
    const response = await fetch(new URL(productUrl))
    if (response.status === 200) {
      const body = await response.text()

      const $ = cheerio.load(body)

      const name = $('.name')
        .text()
        .trim()
      const details = $('.prodSpecification > ul')
        .text()
        .trim()
      const imageUrl = $('.thumbslider > li:first-of-type > a').attr(
        'data-image'
      )
      const originalPrice = parseInt(
        $('.mrpPrice')
          .text()
          .replace('रू ', '')
      )
      const discountedPrice = parseInt(
        $('.offerprize')
          .text()
          .replace('रू ', '')
      )
      if (typeof imageUrl === 'undefined') {
        console.log('\x1b[31m', `Error in ${productUrl}`)
        return {
          name: '',
          details: '',
          imageUrl: '',
          originalPrice: '',
          discountedPrice: '',
          category,
          subCategory,
          subSubCategory,
          productUrl
        }
      }
      return {
        name,
        details,
        imageUrl,
        originalPrice,
        discountedPrice,
        category,
        subCategory,
        subSubCategory,
        productUrl
      }
    }
  } catch (e) {
    console.log('Error found: ', e)
  }
}

module.exports = getSD_products
