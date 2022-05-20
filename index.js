// using express as the framework to manage the project directory stucture and also we are
//fallowing MVC architecture for managing the project's directory.

const express = require("express") ; 

// layouts basically help making ejs files generalized that has some changes and 
// those changes can be embedded with use of <%- body %> where we need insert the changes
// (change are also ejs files).This help in distributing code when the code base 
// grows by many folds. This is used as middleware.

const expressLayouts = require("express-ejs-layouts") ; 

// this library deals with  cookies.
const cookieParser = require("cookie-parser") ; 

// this library returns path when we combine strings.
const path = require("path") ;

// Defining the port on which the website would run.
const port = 7777 ; 

// this encryptes the session cookies.
const session = require("express-session") ;

// making the passport files available for different types of the authentications.
const passport = require("passport") ; 

const passportLocal = require("./config/passport-local-stategy")  ; 



// for making use of SASS. 
const sassMiddleware = require("node-sass-middleware") ; 

//We will require the flash module to send notification to user.
const flash = require("connect-flash") ; 

// this used to for setting flash values in the session cookie.
const myMware = require("./config/middleware") ; 
 
// Use this to fire the express.
const app = express() ; 
const db = require("./config/mongoose") ; 

// This helps to store the info about the session cookie inside the the DB which can help in 
// storing the info about the logged in user even if the server goes down still user will remain logged in till 
// a certain time and the user will ultimately logged out after a certain time.

const Mongostore = require("connect-mongo");

// using SASS middleware.
app.use(sassMiddleware({
    src: "./assets/scss" , 
    dest: "./assets/css" , 
    debug : true , 
    outputStyle : "extended" , 
    prefix : "/css"
})) ;

// View engine that we are using is EJS ie embedded JavaScript it help us to make webpages dynammic as 
// we can use the javascript in html like stuctured file with extension as .ejs to display the 
// required info. Views basically get the required info from the Database with help of various controller
// being setup for the various routes ie for various incoming request.

app.set("view engine" , "ejs") ; 

//setting directory where the views would be there for all normal requests.
app.set("views" , path.join(__dirname , "views")) ; 

// using expressLayouts as middleware to use layouts.
app.use(expressLayouts) ; 

// If we set the 'layout extractScripts' to true then the all sripts used in views will 
// exracted and will be made avialable for the layouts and will be placed where we write 
// <%- script %> all scripts exracted will be placed.
app.set("layout extractScripts" , true) ; 


// If we set the 'layout extractStyles' to true then the all styles used in views will 
// exracted and will be made avialable for the layouts and will be placed where we write 
// <%- style %> all styles exracted will be placed.
app.set("layout extractStyles" , true) ; 

// helps us to deal with cookies.
app.use(cookieParser()) ; 

// this tells the path of files like CSS, JS, Images, Fonts required by the views.
app.use(express.static(path.join(__dirname , "assets"))) ; 

// this middleware converts the request from string to JSON. 
app.use(express.urlencoded()) ; 


// a middleware that is used to create the session cookie and making use of mongoStore to 
// store these session cookies to the databases. 
app.use(session({
    name : "CloudConnect" , 
    resave : false , 
    secret : "This is serious." , 
    saveUninitialized : false , 
    cookie : {
        maxAge : (1000 * 300 ) 
    },
    store: Mongostore.create({
                 mongoUrl: 'mongodb://localhost/SocialMediaDatabase'
        })
})) ; 

//  these are neccessary middleware for passport.
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 

// to set the user making the request to set in the response.locals
app.use(passport.setAuthenticatedUser) ; 


// intiating the flash.
app.use(flash()) ; 
// then setting the value of request value of flash for sometime in the response after 
// that it will automatically get deleted.
app.use(myMware.setFlash) ; 

// if the request is for url starts from "/" then the homePageRouter comes 
// into the picture where furthure dealing is being made.
app.use("/" , require("./routes/homePageRouter")) ; 

// telling the server to work on the port given incase o error there is callback fn to deal with it.
app.listen(port , function(error){
    if(error){
        console.error(`Server was not able to start due to: ${error}`) ; 
        return ; 
    }
    console.log(`Server is up and running on port no: ${port}`) ; 
    return ; 
}) ;

