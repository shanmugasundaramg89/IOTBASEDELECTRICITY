var express = require('express');
var router = express.Router();
const listsController = require('../controllers/lists-controller');

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('search', { title: 'IOT BASED ELECTRICITY' });
}); */
router.get('/', listsController.unitSearch);
router.get('/barchart', listsController.read);
router.get('/:listId/monthview', listsController.viewmonthSearch);
router.get('/:listId/monthfind', listsController.searchmonthfind);
router.post('/:listId/monthfind', listsController.viewmonthfind);
router.post('/', listsController.viewunitSearch);
module.exports = router;
