const cheerio = require('cheerio')
const request = require('request')

module.exports = () => {
  console.log('hello')
  BASE_URL = 'https://www.sastodeal.com'
  CAT_URL = BASE_URL + '/sastodeal/cta-mobiles-28'
  URL_WITH_RANGE = BASE_URL + '/sastodeal/cta-mobiles-28?flag=setFilters&toRange='

  const productUrlList = []
  request(CAT_URL, (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html)
      /* get the total number of products in the category,
       this is required because initially the page loads only
       some of the items but we need to get all the products
       in the category. */
      const totalProductCount = $('#countOfProduct').attr('value')

      request(URL_WITH_RANGE + totalProductCount, (err, res, html) => {
        if(!err && res.statusCode === 200) {
          const $ = cheerio.load(html)

          $(".categoryProduct").each((i, product) => {
            const $product = $(product)
            productURl = BASE_URL + $product.find('a').attr('href')
            productUrlList.push(productURl)
          })
        }
        console.log(productUrlList)
      })
    }
  })
}
