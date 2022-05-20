// Some of the DB documents required for the this controllere file to function properly.
const users = require("../models/userInfoSchema") ; 
const trans = require("../models/transferSchema")  ; 


const { populate } = require("../models/userInfoSchema");

// these are the required modules for the controller file to work.
const res = require("express/lib/response");
const path = require("path") ; 
const fs = require("fs") ; 

// controller function to make new user in Datebase.
module.exports.createNewUser = function(request , response){
    // First of checking the confirm password and passord should match if not then give notifiaction to user
    // via Noty 
    if(request.body.password != request.body.CPassword){
        console.error("Password entered not same.") ; 
        request.flash("error" , "Password entered not same.")
        return response.redirect("back") ; // and going back.
    }
    // Then finding the user via email input field so that we can check that the user 
    // already exists or not.
    users.findOne({email : request.body.email} , function(error , user){
        if(error){
            //if error then give notification via Noty.
            console.log(`Something went wrong: ${error}`) ;
            request.flash("error" , "Something went wrong.")  ; 
            return response.redirect("back") ; // and going back.
        }
        if(user){
            // If the user is found the user is already so give notification of this via 
            // Noty.
            console.error("Email Already in use!") ; 
            request.flash("error" , "Email already in use.") ; 
            return response.redirect("/sign-in") ; // and going to sign-in page.
        }
        if(!user){
            // if user is not there then we are creating the one.
            users.create({
                email : request.body.email , 
                name : request.body.name , 
                password : request.body.password , 
                balance : 1000 , 
                loan : 0 
            } , function(error , newUser){
                if(error){
                    //if error then give notification via Noty.
                    console.error(`Error in creating new User: ${error}`) ; 
                    request.flash("error" , "Error in creating user") ; 
                    return response.redirect("back") ; 
                }
                // if user is created successful then we give notication via noty for successful account 
                // creation. 
                console.log(`New User Created Succesfully : ${newUser}`) ; 
                request.flash("success" , "Account Created Successfully") ; 
                return response.redirect("/sign-in") ; // and then go to sign-in page.
            }); 
        }
    }) ; 
}  

// // made this controller function asynchronous so one function is executed before moving to next.
module.exports.showProfile = async function(request , response){
    try{
        let user = await users.findById(request.params.id) ; // then finding the targeted user of which profile is
        // being openned.

         
        
        return response.render("bankhome" , {
            layout : "bankhome.ejs" ,
            targetUser : user  
        }) ;
    }
    catch(error){
        //if error then give notification via Noty.
        console.error(`Sonething went wrong --> ${error}`) ; 
        request.flash("error" , "Something went wrong") ; 
        response.redirect("back") ; // and going back.
    }
}
  
// made this controller function asynchronous so one function is executed before moving to next.
module.exports.showHomePage = async function(request , response){
    try{
        let user = await users.findById(request.params.id) ; // then finding the targeted user of which profile is
        
        let transDetail = await trans.find({transOwner : request.user._id}) ; 

        console.log(transDetail) ; 
        transDetail.reverse() ; 

        let inAmount = 0 ; 
        let outAmount = 0 ; 
        let interest = 0 ; 
        for(let transc of transDetail ){
            if(transc.transType == "Loan"){

                let dated = new Date(transc.transDate);
                let today = new Date() ; 
                let year = today.getFullYear() - dated.getFullYear() ; 
                year += ((today.getMonth()+1) - (dated.getMonth() +1 ))/12 ; 

                interest += (year * 0.02 * transc.ammount) ; 
                console.log(interest) ;
            }
            if(transc.ammount > 0){
                inAmount += (transc.ammount) ; 
            }else{
                outAmount += (-1)*(transc.ammount) ; 
            }
        }
        

        return response.render("bankhome.ejs" , {
            layout : "bankhome.ejs" ,
            targetUser : user , 
            transactions : transDetail , 
            inA : inAmount , 
            outA : outAmount , 
            intA : interest 
        }) ;
    }catch(error){
        //if error then give notification via Noty.
        console.error(`Sonething went wrong--> ${error}`) ; 
        request.flash("error" , "Something went wrong") ;
        return response.redirect("back") ; // and going back.
    }
}

module.exports.doTransfer = function(request , response){

    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;


    users.findOne({email : request.body.email} , function(error , userRec){
        if(error){
            console.log("Something went wrong: " + error) ; 
            request.flash("error" , "Something went wrong!!") ; 
            return response.redirect("/") ; 
        }
        users.findById(request.user.id , function(error , userSender){
            if(error){
                console.log("Something went wrong: " + error) ; 
                request.flash("error" , "Something went wrong!!" ) ; 
                return response.redirect("/") ; 
            }

            if(userSender.balance < request.body.amount){
                console.log(`Invalid Transaction.`) ; 
                request.flash("Invalid Transaction." ) ; 
                return response.redirect("/") ; 
            }

            console.log(userRec) ; console.log("#####") ; console.log(userSender) ; 
            userSender.balance -= request.body.amount ; 
            userRec.balance = parseInt(userRec.balance) + parseInt(request.body.amount) ; 

            trans.create({
                ammount : request.body.amount * (-1) ,  
                transType : "Withdrawal" , 
                transDate : today , 
                transOwner : userSender._id 
            } , function(error , trn){
                if(error){
                    console.error(`Sonething went wrong --> ${error}`) ; 
                    request.flash("error" , "Something went wrong") ; 
                    response.redirect("back") ;
                }
            }) ; 

            trans.create({
                ammount : request.body.amount , 
                transType : "Deposit" , 
                transDate : today , 
                transOwner : userRec._id 
            }, function(error , trn){
                if(error){
                    console.error(`Sonething went wrong --> ${error}`) ; 
                    request.flash("error" , "Something went wrong") ; 
                    response.redirect("back") ;
                }
            }) ; 

            userSender.save() ; 
            userRec.save() ; 
        })
    }) ; 
    request.flash("success" , "Transction Done Successfully.") ; 
    return response.redirect("back") ; 
}

module.exports.getLoan = function(request , response){

    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    users.findById(request.user.id , function(error , userApplier){
        if(error){
            console.log("Something went wrong: " + error) ; 
            request.flash("error" , "Something went wrong!!" ) ; 
            return response.redirect("/") ; 
        }
        userApplier.balance = parseInt(userApplier.balance) + parseInt(request.body.amount) ; 

        trans.create({
            ammount : request.body.amount ,  
            transType : "Loan" , 
            transDate : today , 
            transOwner : userApplier._id 
        } , function(error , trn){
            if(error){
                console.error(`Sonething went wrong --> ${error}`) ; 
                request.flash("error" , "Something went wrong") ; 
                response.redirect("back") ;
            }
        }) ;
        userApplier.save() ; 
    }) ; 
    request.flash("success" , "Loan Approved.") ; 
    return response.redirect("back") ; 
}

module.exports.delAC = function(request , response){
    users.deleteOne({email: request.body.email} , function(error){
        if(error){
            console.log("Something went wrong: " + error) ; 
            request.flash("error" , "Something went wrong!!" ) ; 
            return response.redirect("/") ; 
        }
        console.log("Delete Successfully") ; 
        request.flash("success" , "Account Deleted!!!") ; 
        return response.redirect("/sign-up") ;  ; 
    }) ; 
}

// setting up home page for the valid users. 
module.exports.createSessionForValidUserMainMethod = function(request , response){
    request.flash("success" , "Logged in Successfully!!!") ; 
    return response.redirect(`/users/home-page/${request.user.id}`) ; 
}

module.exports.destroySession = function(request , resposne){
    request.logout() ; 
    // Passport exposes a logout() function on req (also aliased as logOut() ) 
    // that can be called from any route handler which needs to terminate a login session.
    request.flash("success" , "Logged out Successfully!!!") ; 
    return resposne.redirect("/") ; 
}


