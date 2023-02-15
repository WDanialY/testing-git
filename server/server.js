 const express = require("express");

 const app = express();

 app.get("/", function(req, res) {
     res.send("fuck ya");
 });

 app.get("/contact", function(req, res) {
     res.send("It's private bitch!1!!!");
 });

 app.get("/about", function(req, res) {
     res.send("Nothing to about that nigga");
 });

 app.listen(3000, function() {
     console.log("hehe boiii");
 });