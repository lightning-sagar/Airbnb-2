const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the owner of this listing');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    console.log(req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }

};



module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You cannot delete this as you are not the author of review');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
