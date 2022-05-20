// we need same instance of the data base established before.
const mongoose = require("mongoose") ; 


const userSchema = mongoose.Schema({
    email : {
        type : String , 
        required: true , 
        unique : true
    } , 
    password : {
        type: String , 
        required : true 
    } , 
    name : {
        type: String , 
        required : true 
    } , 
    balance : {
        type : Number , 
        required : true 
    } , 
    loan : {
        type : Number , 
        required : true 
    }
} , {
    timestamps : true 
}) ; 

// creating user document using the userSchema.
const users = mongoose.model("users" , userSchema) ; 

// exporting the user document created by the above step.
module.exports = users ; 