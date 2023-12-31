const express = require('express')
const router = express.Router({mergeParams:true})
const User = require('../models/user.js')
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync.js')
const {saveRedirectUrl} = require('../middleware.js')
const usermodule = require('../controllers/user.js') 

router
    .route('/signup')
    .get(usermodule.renderSinginup)
    .post( wrapAsync(usermodule.postsignup));


router
    .route('/login')
    .get(usermodule.renderlogin)
    .post(saveRedirectUrl,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),usermodule.postlogin)    

router.get('/logout',usermodule.logout)

module.exports = router