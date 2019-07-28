const cheerio = require('cheerio')
const fetch = require('node-fetch')

const baseUrl = 'https://www.daraz.com.np'

const getDaraz_categories = async function(client, dbName, Daraz_categories_col) {
  const response = await fetch(baseUrl)
  const body = await response.text()

  const $ = cheerio.load(body)

  const $categoryList = $('.lzd-site-menu-root')

  const categories = []
  $categoryList
    .find('.lzd-site-menu-root-item')
    .each((i, category) => {
      $category = $(category)
      const categoryName = $category.find('span').text()
      const subCategoryList = $categoryList.find(`[data-cate^="cate_${i+1}_"]`)
      subCategoryList
        .each((i, subCategory) => {
          const $subCategory = $(subCategory)
          const subCategoryName = $subCategory.find('> a > span').text()
          const subCategoryUrl = $subCategory.find('a').attr('href').replace('//', '')
          const subSubCategoryList = $subCategory.find('> ul > li')
          categoriesssss = []
          if (subSubCategoryList.length === 0) {
            categories.push({
              visited: false,
              name: categoryName,
              url: null,
              subCategory: {
                name: subCategoryName,
                url: subCategoryUrl,
                subSubCategory: {
                  name: subCategoryName,
                  url: subCategoryUrl
                }
              }
            })
          } else {
            subSubCategoryList
            .each((i, subSubCategory) => {
              const $subSubCategory = $(subSubCategory)
              const subSubCategoryName = $subSubCategory.text().trim()
              const subSubCategoryUrl = $subSubCategory.find('a').attr('href').replace('//', '')
              categories.push({
                visited: false,
                name: categoryName,
                url: null,
                subCategory: {
                  name: subCategoryName,
                  url: subCategoryUrl,
                  subSubCategory: {
                    name: subSubCategoryName,
                    url: subSubCategoryUrl
                  }
                }
              })
            })
          }
        })
    })

  const db = client.db(dbName)
  const Daraz_categories = db.collection(Daraz_categories_col)

  try {
    const count = await Daraz_categories.countDocuments()
    if (count !== 0) {
      console.warn(
        `The daraz categories collection already has ${count} items. Delete collection to repopulate`
        )
    } else {
      try {
        const res = await Daraz_categories.insertMany(categories)
        console.log(res.result)
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = getDaraz_categories