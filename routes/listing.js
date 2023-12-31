const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

router.get('/new', isLoggedIn, listingController.render);

router
    .route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner,upload.single('listing[image]'),wrapAsync(listingController.deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.RenderEditForm));

module.exports = router;
