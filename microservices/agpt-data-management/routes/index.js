const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const AGPTController = require('../controllers/AGPTControllers')

/* GET AGPT data for a country, selecting the production type and time range. */
router.get('/getData/:countryID/:productionType/:dateFrom/:dateTo', AGPTController.getData);

/* POST AGPT data for a country, selecting the production type and time range. */
router.post('/postData', upload.single('data'), AGPTController.postData);

/* Reset AGPT data. */
router.post('/resetData', AGPTController.resetData);

module.exports = router;
