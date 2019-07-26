const cheerio = require("cheerio")
const fetch = require('node-fetch')

const category_list_locator = "ul.main-navigation > li";
const categoriesWithUrls = [];

function getCategoryInfo($category) {
  itemTitle = $category.find("a").first();
  name = itemTitle.text().trim();
  url = itemTitle.attr("href");
  return { name, url };
}

const getSD_categories = async function(client, dbName, SD_categories_col) {
  BASE_URL = "https://www.sastodeal.com/home.html"
  const response = await fetch(BASE_URL)
  const body = await response.text()

  const $ = cheerio.load(body)
  $("img")
    .nextAll()
    .remove();

  $(category_list_locator).each((i, category) => {
    const $category = $(category);
    ({ name: categoryName,
      url: categoryUrl
      } = getCategoryInfo($category));

    $category.find("ul > li").each((i, subCategory) => {
      const $subCategory = $(subCategory);
      ({
        name: subCategoryName,
        url: subCategoryUrl
      } = getCategoryInfo($subCategory));

      $subCategory.find(".floatleft > a").each((i, subSubCategory) => {
        subSubCategoryName = $(subSubCategory).text();
        subSubCategoryUrl = $(subSubCategory).attr("href");
        categoriesWithUrls.push({
          visited: false,
          name: categoryName,
          url: categoryUrl,
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
    })
  })

  const db = client.db(dbName)
  const SD_categories = db.collection(SD_categories_col)

  try {
    const count = await SD_categories.countDocuments()
    if (count !== 0) {
      console.warn(
        `The sastodeal categories collection already has ${count} items. Delete collection to repopulate`
        )
    } else {
      try {
        const res = await SD_categories.insertMany(categoriesWithUrls)
        console.log(res.result)
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = getSD_categories