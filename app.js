const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./models/listing')
const path = require ('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/ExpressError')
const {listingSchema , reviewSchema} = require('./schema.js')
const reviews = require('./models/review.js')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))
app.set ('views', path.join(__dirname, 'views')) 
app.use(express.urlencoded({extended: true}))
app.use (methodOverride('_method'))
app.engine('ejs', ejsMate)

main().then(()=>{
  console.log("connectrd to DB");
})
.catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const validateListing = (req, res, next) => {
  const { image, ...rest } = req.body.listing;

  // Log the image data for debugging
  console.log('Image data received:', image);
  console.log('Listing Data:', req.body.listing);


  // Check if image is an object with filename and url properties
  if (image && typeof image === 'object' && image.filename && image.url) {
    // Valid image object, continue with validation
    next();
  } else {
    // Invalid image object, handle the error
    throw new ExpressError('Invalid image data', 400);
  }
};




const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body)
  if(error){
    let msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else{
    next()
  }
}

app.get('/listings', async (req, res) => {
  let allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings})
})

app.get('/listings/new', (req, res) => {
  const emptyListing = {
    // other fields...
    image: {
      filename: 'listingimage',
      url: '',
    },
  };
  console.log(emptyListing);
  res.render('listings/new.ejs', { listing: emptyListing });
});





app.get('/listings/:id',wrapAsync( async (req, res) => {
  let {id}= req.params
  let listing = await Listing.findById(id).populate('reviews')
  res.render('listings/show.ejs', {listing})
}))

app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
  // Convert price to a number
  req.body.listing.price = parseInt(req.body.listing.price);

  // If no URL is provided, set a default one
  if (!req.body.listing.image.url) {
    req.body.listing.image.url = 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'; // Replace with your default URL
  }

  // Log the listing data before saving
  console.log('Listing data before saving:', req.body.listing);

  let result = listingSchema.validate(req.body);

  if (result.error) {
    throw new ExpressError(result.error.message, 400);
  }

  let newListing = new Listing(req.body.listing);
  await newListing.save();

  // Log a success message
  console.log('Listing saved successfully.');

  res.redirect('/listings');
}));





app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
  if (!req.params.id) {
    throw new ExpressError('Invalid data', 400);
  } 
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
}));


app.put('/listings/:id',validateListing, wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { image, ...updatedListing } = req.body.listing;

    // Update only the necessary fields, including the image URL
    const updatedListingWithImage = { ...updatedListing, image };

    await Listing.findByIdAndUpdate(id, updatedListingWithImage);
    res.redirect('/listings');
  } catch (err) {
      console.log(err);
        res.redirect('/listings');
  }
}));

app.delete('/listings/:id',wrapAsync( async (req, res) => {
  let {id} = req.params
  let deletedListing = await Listing.findByIdAndDelete(id)
  res.redirect('/listings') 
}))

app.post('/listings/:id/reviews',validateReview,wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new reviews(req.body.review)

  listing.reviews.push(newReview)

  await newReview.save()
  await listing.save()
  res.redirect(`/listings/${listing._id}`)
}))


app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await reviews.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

// app.use((err, req, res, next) => {
//   if (err.statusCode) {
//     res.status(err.statusCode).render('error.ejs', { statusCode: err.statusCode, message: err.message });
//   } else {
//     next(err);
//   }
// });

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).render('error.ejs', { statusCode: 500, message: 'Internal Server Error' });
// });


app.listen(3000, () => {
  console.log('Server started on port 3000')
})