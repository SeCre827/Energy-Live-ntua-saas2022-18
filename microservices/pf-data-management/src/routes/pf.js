// aggregation generation per type
const express = require('express');
const multer = require('multer');
const upload = multer(); // if i want to save the file multer({ dest: 'uploads/' })
const isAuth = require('../middleware/is-auth');

const agptController = require('../controllers/agptControllers');

const router = express.Router();

//  url: /update_data endpoint  -> Updates the Database from the data given from in csv
router.post('/update_data', upload.single('data'), agptController.updateData);

// url '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo', gets the data for a countrie pair between the specified dates
router.get(
  '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo',
  isAuth,
  agptController.getData
);

// /resetDB route: resets the db and inserts the starting data
router.post('/resetDB', agptController.resetDB);

module.exports = router;
