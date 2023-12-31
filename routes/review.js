const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync')
const Listing = require('../models/listing')
const Review = require('../models/review.js')
const {validateReview,isLoggedIn,isAuthor, isOwner} = require('../middleware.js')
const reviews = require('../controllers/reviews.js')

router.post('/',isLoggedIn,wrapAsync(reviews.CreateReview))
  
  
router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(reviews.deleteReview))

module.exports = router