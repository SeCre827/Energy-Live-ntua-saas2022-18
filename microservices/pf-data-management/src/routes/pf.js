// aggregation generation per type
const express = require('express');
const multer = require('multer');
const upload = multer(); // if i want to save the file multer({ dest: 'uploads/' })

const agptController = require('../controllers/agptControllers');

const router = express.Router();

router.get('/pog', agptController.pog);

router.post('/update_data', upload.single('data'), agptController.updateData);

router.get(
  '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo',
  agptController.getData
);

module.exports = router;
