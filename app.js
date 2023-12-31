if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require ('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const listingsRoutes = require('./routes/listing.js')
const reviewsRoutes = require('./routes/review.js')
const usersRoutes = require('./routes/user.js')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))
app.set ('views', path.join(__dirname, 'views')) 
app.use(express.urlencoded({extended: true}))
app.use (methodOverride('_method'))
app.engine('ejs', ejsMate)
 
const sessionOptions = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;

  // Check if req.session is defined before accessing originalUrl
  if (req.session && req.session.originalUrl) {
    res.locals.originalUrl = req.session.originalUrl;
  }

  next();
});

app.use('/listings', listingsRoutes)
app.use('/listings/:id/reviews', reviewsRoutes)
app.use('/', usersRoutes)   

// 658bb13c985f376837e9f11f
  
 


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