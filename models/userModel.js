const mongoose = require("mongoose");

 
// create an schema
var userSchema = new mongoose.Schema({
            fname: {type:String},
            lname: {type:String},
            email: {type:String},
            password:{type:String}
        });
 
var userModel=mongoose.model('users',userSchema);
 
module.exports = mongoose.model("Users", userModel);