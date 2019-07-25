const cheerio = require('cheerio')
const fetch = require('node-fetch')

const productUrlList = []

const getSD_categoriesDB = async (client, dbName, SD_categories_col) => {
  const db = client.db(dbName)
  const SD_categories = db.collection(SD_categories_col)

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

const getSD_products =  async (client, dbName, SD_categories_col, SD_products_col) => {
  console.log('here I a')

  const SD_categories = await getSD_categoriesDB(
    client, dbName, SD_categories_col
  )


  await asyncForEach(SD_categories, async (SD_category) => {
    let productsList = []
    const category = SD_category.name
    const subCategory = SD_category.subCategory.name
    const subSubCategory = SD_category.subCategory.subSubCategory.name
    const subSubCategoryUrl = SD_category.subCategory.subSubCategory.url

    console.log(subSubCategory)

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
    await asyncForEach(productUrlList, async (productUrl) => {
      const productDetails = await getProductDetail(productUrl, category, subCategory, subSubCategory)
      productsList.push(productDetails)
    })

  const db = client.db(dbName)
  const SD_products = db.collection(SD_products_col)
  console.log('Product length is ', productsList.length)

  try {
    const count = await SD_products.countDocuments()
    if (count !== 0) {
      console.warn(
        `The sastodeal products collection already has ${count} items. Delete collection to repopulate`
        )
      process.exit(1)
    } else {
      try {
        const res = await SD_products.insertMany(productsList)
        console.log(res.result)
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
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
