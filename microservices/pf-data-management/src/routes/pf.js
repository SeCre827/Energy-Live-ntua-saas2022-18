// aggregation generation per type
const express = require('express');
const multer = require('multer');
const upload = multer(); // if i want to save the file multer({ dest: 'uploads/' })
const isAuth = require('../middleware/is-auth');

const pfController = require('../controllers/pfControllers');

const router = express.Router();

//  url: /update_data endpoint  -> Updates the Database from the data given from in csv
router.post('/update_data', upload.single('data'), pfController.updateData);

// url '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo', gets the data for a country pair between the specified dates
router.get(
  '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo',
  isAuth,
  pfController.getData
);

module.exports = router;
