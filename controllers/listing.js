const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
};

module.exports.Arctic = async (req, res) => {
  const newz = req.params.newz;
  const allListings = await Listing.find({ category: newz });
  res.render('listings/index.ejs', { allListings });
};

module.exports.location = async (req, res, next) => {
  const country = req.params.country;
  console.log(country);
  const allListings = await Listing.find({ country: country });
  res.render('listings/index.ejs', { allListings });
};

module.exports.render = async (req, res) => {
  const emptyListing = {
    image: {
      filename: 'listingimage',
      url: '',
    },
  };
  res.render('listings/new.ejs', { listing: emptyListing });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
  if (!listing) {
    req.flash('error', 'listing not found');
    res.redirect('/listings');
  } else {
    res.render('listings/show.ejs', { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  console.log(req.file, 'file');
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url,
    filename
  };
  await newListing.save();
  req.flash('success', 'Successfully added a new listing!');
  console.log('listing is added successfully.');
  res.redirect('/listings');
};

module.exports.RenderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'listing not found');
    res.redirect('/listings');
  }
  let orginialImage = listing.image.url;
  orginialImage = orginialImage.replace('/upload', '/upload/w_250');
  res.render('listings/edit.ejs', { listing, orginialImage });
};

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
      let filename = req.file.filename;
      let url = req.file.path;
      listing.image = {
        filename,
        url
      };
      await listing.save();
    }
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    req.flash('error', err.message);
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a listing!');
  res.redirect('/listings');
};
