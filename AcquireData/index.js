const inquirer = require('inquirer')

inquirer
  .prompt([
    {
      type: 'list',
      name: 'site',
      message: 'What site you want to scrape?',
      choices: [
        'SastoDeal',
        'Daraz',
        new inquirer.Separator(),
        'Please select the site you want to scrape'
      ]
    },
    {
      type: 'list',
      name: 'catOrProd',
      message: 'Do you want to scrape category list or product details?',
      choices: ['categories list', 'product details',
      new inquirer.Separator(),
      'Please select if you want to scrape category urls or products detail',
      '*Note* to scrape products detail you have to have scraped category urls earlier'
    ]
    }
  ])
  .then(answers => {
    answers = JSON.stringify(answers, null, '  ')
  })