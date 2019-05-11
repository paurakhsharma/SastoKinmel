const db = require('../db/db')

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  db.GetAllProducts((products) => {
    res.status(200).json(products)
  })
});

module.exports = router;
