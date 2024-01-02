const Listing = require('../models/listing');
module.exports.Arctic = async (req, res) => {
    const newz = req.params.newz;
    const allListings = await Listing.find({ category: newz });
    res.render('listings/index.ejs', { allListings });
};

module.exports.location = async (req, res, next) => {
    const searchcountry = req.params.country;
    const allListings = await Listing.find({ country: searchcountry });
    res.render('listings/index.ejs', { allListings });
    console.log(allListings);
};
  