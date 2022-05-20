const { render } = require("express/lib/response");
// loading users document.
const users = require("../models/userInfoSchema");

// rendering the Sign-in page controller.
module.exports.renderSigninPage = function(request , response){
    if(request.isAuthenticated()){
        // If the user is already authenticated then this will automatically redirect back to 
        // profile page.
        // What actually this function do is that it checks the session cookie for the user id and decryptes it 
        // then find whether that user exits in Users DB.
        return response.redirect("/users/profile/" + request.user.id) ; 
    }
    // If user is not logged in then 
    console.log("Sign-In Page Rendered") ; 
    var data = {
        layout : "layout1.ejs" , 
        title : "Cloud Connect | Sign-in" 
    }
    return response.render("sign-in" , data ) ; 
}

// rendering the Sign-up page controller.
module.exports.renderSignUpPage = function(request , response){
    if(request.isAuthenticated()){
        return response.redirect("/users/profile/" + request.user.id) ; 
    }
    console.log("Sign-Up Page Rendered") ; 
    var data = {
        layout : "layout1.ejs" , 
        title : "Cloud Connect | Sign-Up" 
    }
    return response.render("sign-up" , data) ; 
}

// rendering the main page of website controller.
module.exports.renderHomePage = function(request , response){
    if(request.isAuthenticated()){
        return response.redirect("/users/profile/" + request.user.id) ; 
    }
    console.log("Home Page Rendered") ; 
    var data = {
        layout : 'layout1.ejs' , 
        title : "Cloud Connect | Home Page" 
    }
    return response.render("home" , data ) ; 
} ; 