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
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

router.get('/new', isLoggedIn, wrapAsync(listingController.render));

router
    .route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner,upload.single('listing[image]'),wrapAsync(listingController.deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.RenderEditForm));

    
router.get('/Rooms',wrapAsync(listingController.Rooms))
router.get('/Iconic-City',wrapAsync(listingController.IconicCity))
router.get('/Mountain',wrapAsync(listingController.Mountain))
router.get('/Castle',wrapAsync(listingController.Castle))
router.get('/Pool',wrapAsync(listingController.Pool))
router.get('/Camping',wrapAsync(listingController.Camping))
router.get('/Farms',wrapAsync(listingController.Farms))
router.get('/Arctic',wrapAsync(listingController.Arctic))

router.get('/:country', wrapAsync(listingController.location));



module.exports = router;
