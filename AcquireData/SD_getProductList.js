const cheerio = require('cheerio')
const request = require('request')

module.exports = () => {
  console.log('hello')
  BASE_URL = 'https://www.sastodeal.com'
  CAT_URL = BASE_URL + '/sastodeal/cta-mobiles-28'
  URL_WITH_RANGE =
    BASE_URL + '/sastodeal/cta-mobiles-28?flag=setFilters&toRange='

  const productUrlList = []
  const productList = []
  request(CAT_URL, (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html)
      /* get the total number of products in the category,
       this is required because initially the page loads only
       some of the items but we need to get all the products
       in the category. */
      const totalProductCount = $('#countOfProduct').attr('value')

      request(URL_WITH_RANGE + totalProductCount, (err, res, html) => {
        if (!err && res.statusCode === 200) {
          const $ = cheerio.load(html)

          $('.categoryProduct').each((i, product) => {
            const $product = $(product)
            productURl = BASE_URL + $product.find('a').attr('href')
            productUrlList.push(productURl)
          })
        }

        productUrlList.forEach(productUrl => {
          request(productUrl, (err, res, html) => {
            if (!err && res.statusCode === 200) {
              const $ = cheerio.load(html)

              const name = $('.name').text().trim()
              const details = $('.prodSpecification > ul').text().trim()
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
              productList.push({
                name,
                details,
                imageUrl,
                originalPrice,
                discountedPrice
              })
              console.log(productList.length)
            }
          })
        })
      })
    }
  })
}
