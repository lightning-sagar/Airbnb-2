const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const wrapAsync = require('../utils/wrapAsync');
const filtersController = require ('../controllers/filters');

router.get('/:newz', wrapAsync(filtersController.Arctic));

router.get('/new/:country', wrapAsync(filtersController.location));

module.exports = router;