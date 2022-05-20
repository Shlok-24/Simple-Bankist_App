// Configuring the databases of the website.
// First we need to require the mongoose module.
const mongoose = require("mongoose") ; 
// locating the database of the website.
mongoose.connect("mongodb://localhost/BankistApp") ; 

const db = mongoose.connection ; 

// on connection if there is error then :-
db.on("error" , function(error){
    console.error(`Failed To Connect to the DataBase due to: ${error}`) ; 
    return ; 
}) ; 
// on connection being established then :-
db.once("open" , function(){
    console.log("Succesfully Connected to the Database") ; 
}) ; 

