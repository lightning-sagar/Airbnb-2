const User = require('../models/user.js')


module.exports.renderSinginup = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.postsignup = async (req, res) => {
    try{
        let { username, email, password } = req.body.user;
        let newuser = new User({ email, username });

    
        const registeredUser = await User.register(newuser, password);
        
        console.log('Registered user:', registeredUser);
        
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listings');
        })  
    }
    catch{
        req.flash('error', 'Error signing up');
        res.redirect('/signup');
    }
}

module.exports.renderlogin = (req, res) => {
    res.render('users/login.ejs')   
}

module.exports.postlogin =async (req, res) => {
    try{
        req.flash('success', 'Welcome back!');
        let redirectUrl = req.session.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }
    catch{
        req.flash('error', 'Error logging in');
        res.redirect('/login');
    }
}

module.exports.logout =  (req, res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash('success', 'You are logout,Goodbye!');
        res.redirect('/listings');
    });
}