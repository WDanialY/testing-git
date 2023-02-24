 const express = require("express");
 const bodyParser = require('body-parser');
 const path = require('path');
 const mongoose = require('mongoose');
 const app = express();
 
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static(path.join(__dirname, "website")));

 const urlDatabase = 'mongodb://localhost:27017/';

 mongoose.connect(urlDatabase);
 const UserSet = mongoose.model('users', {name: String});
 const user = new UserSet({ name: 'Bob'});
 user.save().then(()=>console.log('Data saved to MongoDB'));



// # PAGE REQUEST

 app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
 });

 app.get("/signin", function(req, res){
    res.sendFile(__dirname + "/website/signin.html");
 });

 app.get("/signup", (req, res) =>{
    res.sendFile(__dirname + "/website/signup.html");
 });

 app.get("/forgot-password.html", (req, res) =>{
    res.sendFile(__dirname + "/website/forgot-password.html");
 });





//  # LOCALHOST

 app.listen(3000, function() {
     console.log("Localhost set on  port 3000");
 });