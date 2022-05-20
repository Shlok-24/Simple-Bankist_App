// we need same instance of the data base established before.
const mongoose = require("mongoose") ; 


const tranfSchema = mongoose.Schema({
    ammount : {
        type : Number , 
        required: true 
    } , 
    transType : {
        type : String , 
        required : true 
    } , 
    transDate : {
        type: String , 
        requried : true 
    } , 
    transOwner : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "users"
    } 
})

// creating user document using the tranfSchema.
const trans = mongoose.model("trans" , tranfSchema) ; 

// exporting the user document created by the above step.
module.exports = trans ; 