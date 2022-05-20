// this is function to set value success , error to be displayed with the help of Noty. 
// a kind of middleware. 
module.exports.setFlash = function(request , response , next){
    response.locals.flash = {
        "success" : request.flash("success") , 
        "error" : request.flash("error") 
    } ; 
    next() ; 
} ; 