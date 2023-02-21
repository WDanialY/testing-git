 const express = require("express");
 const bodyParser = require('body-parser');

 const app = express();

 app.use(express.static('website'));

 app.get("/", function(req, res) {
     res.sendFile(__dirname + "/website/index.html");
 });

 app.get("/signin", function(req, res){
    res.sendFile(__dirname + "/website/signin.html");
 });

 app.listen(3000, function() {
     console.log("Localhost set on  port 3000");
 });