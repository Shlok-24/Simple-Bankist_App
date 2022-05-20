const req = require("express/lib/request");

// all the neccessary modules:
const passport = require("passport") ; 
const LocalStrategy = require("passport-local") ; 
// this the passport statergy that we are goiing to use for authentication of the logged in user.

// we need to require the User document that is actually a array of Users with their infos.
const Users = require("../models/userInfoSchema") ; 


//  telling the passport that we are going to use this Strategy with the following properties.
passport.use(new LocalStrategy({
    // field in our schema that is unique.
    usernameField : "email" , 
    // if we want to pass the request to the below callback function then we make this key to true.
    passReqToCallback: true
} , 

    function(req, email , password , done){
        // finding the user with the given email id. 
        Users.findOne({email : email} , function(error , user){
            if(error){
                // incase of some error we notification to the user via Noty.
                req.flash("error","Something went wrong.") ; 
                return done(error) ; // giving done function error.
            }

            if(!user || user.password != password){
                // incase of password wrong we tell the user that no suer found via Noty.
                req.flash("error","No such user found.") ; 
                return done(null , false) ; // giving false to done as no user is found and 
                // no identity should be established.
            }

            return done(null , user) ; // giving the user found to done so that
            // corresponding identity can be established.
        })
    }

)) ; 
// now we are setting up the identity for the user using done function.
// this is used to set key which is required to the cookies.

passport.serializeUser(function(user , done){
    // user.id gives value like '62519a08230dd38e2f8fe1f6' ie as a string but 
    // user._id gives value like new ObjectId("62519a08230dd38e2f8fe1f6") ie as object type.
    return done(null , user.id) ; 
}); 

// finding the user from the session cookie stored and remember this is done on the server side 
// so no need to worry about it.
passport.deserializeUser(function(id , done){
    Users.findById(id , function(error ,user){
        if(error){
            return done(error) ; 
        }
        return done(null , user) ; 
    }) ; 
}) ; 

passport.checkAuthentication = function(request , response , next){
    // if the user is signed then pass on to next fucntion middleware.
    if(request.isAuthenticated()){
        console.log("Users is Authenticated") ; 
        return next() ;
    }
    // if the user is not signed in 
    return response.redirect('/sign-in') ; 
}
// this middleware sets the user in the locals of the page. 
passport.setAuthenticatedUser = function(request, response, next){
    if (request.isAuthenticated()){
        response.locals.user = request.user;
    }
    next();
}
