const cheerio = require('cheerio')
const fetch = require('node-fetch')

const productUrlList = []
module.exports = async (catUrl, category, subCategory, subSubCategory) => {
  BASE_URL = 'https://www.sastodeal.com'
  CAT_URL = BASE_URL + catUrl
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

  const promises = []
  productUrlList.forEach((productUrl, index) => {
    // the response from `getProductDetail` is a promise
    // so store them in the promise array
    promise = getProductDetail(
      productUrl,
      category,
      subCategory,
      subSubCategory
    )
    promises.push(promise)
  })

  // Now you get details of all the products in the category
  return Promise.all(promises)
    .then(allProducts => {
      return allProducts
    })
    .catch(error => {
      console.log('Error at promise.all', error)
    })
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
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
      // console.log({
      //   name,
      //   details,
      //   imageUrl,
      //   originalPrice,
      //   discountedPrice
      // })
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
          subSubCategory
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
        subSubCategory
      }
    }
  } catch (e) {
    console.log('Error found: ', e)
  }
}
