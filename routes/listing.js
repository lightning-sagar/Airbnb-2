const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing');
const wrapAsync = require('../utils/wrapAsync');

// Index route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// New listing route
router.get('/new', isLoggedIn, wrapAsync(listingController.render));

// Specific listing routes
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.RenderEditForm));

module.exports = router;
