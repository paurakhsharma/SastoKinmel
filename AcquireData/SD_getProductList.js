const cheerio = require('cheerio')
const fetch = require('node-fetch')

const productUrlList = []
module.exports = async () => {
  console.log('hello')
  BASE_URL = 'https://www.sastodeal.com'
  CAT_URL = BASE_URL + '/sastodeal/cta-mobiles-28'
  URL_WITH_RANGE =
    BASE_URL + '/sastodeal/cta-mobiles-28?flag=setFilters&toRange='

  const response = await fetch(CAT_URL)
  const body = await response.text()

  const $ = cheerio.load(body)
  /* get the total number of products in the category,
    this is required because initially the page loads only
    some of the items but we need to get all the products
    in the category. */
  const totalProductCount = $('#countOfProduct').attr('value')

  // hera all represent all the products in the category
  const responseAll = await fetch(URL_WITH_RANGE + totalProductCount)
  const bodyAll = await responseAll.text()
  const $all = cheerio.load(bodyAll)

  $all('.categoryProduct').each((i, product) => {
    const $product = $all(product)
    // get the product url
    productUrl = BASE_URL + $product.find('a').attr('href')
    productUrlList.push(productUrl)
  })

  const promises = []
  productUrlList.forEach(productUrl => {
    // the response from `getProductDetail` is a promise
    // so store them in the promise array
     promise = getProductDetail(productUrl)
    promises.push(promise)
  })

  // Now you get details of all the products in the category
  Promise.all(promises).then((allProducts) => {
    console.log(allProducts)
  })
}

/**
 * Get the details of each product
 *
 * @param {string} url
 *
 */
async function getProductDetail(url) {
  const response = await fetch(url)
  if (response.status === 200) {
    const body = await response.text()

    const $ = cheerio.load(body)

    const name = $('.name')
      .text()
      .trim()
    const details = $('.prodSpecification > ul')
      .text()
      .trim()
    const imageUrl = $('.thumbslider > li:first-of-type > a').attr('data-image')
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

    return {
      name,
      details,
      imageUrl,
      originalPrice,
      discountedPrice
    }
  }
}
