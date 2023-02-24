 const express = require("express");
 const bodyParser = require('body-parser');
 const path = require('path');
 const MongoClient = require('mongodb').MongoClient;

 const urlDatabase = 'mongodb+srv://admin:<dxAPYGqu8wX9wIzJ>@test-1.2ykvs.mongodb.net/?retryWrites=true&w=majority';
 const nameDatabase = 'UserDatabase';

 const client = new MongoClient(urlDatabase);


 const app = express();
 app.use(bodyParser.urlencoded({extended: true}));

 app.use(express.static(path.join(__dirname, "website")));


 client.connect((err) =>{
    if (err) throw err;
    console.log('Database connected successfully');

    const db = client.db(nameDatabase);

    app.post("/signin", (req, res)=>{
        db.collection('users').findOne({ email: email }, function(err, user) {
            if (err) {
              console.log(err);
              res.status(500).send('Internal server error');
            } else if (!user) {
              res.status(401).send('Invalid email or password');
            } else if (user.password !== password) {
              res.status(401).send('Invalid email or password');
            } else {
              res.status(200).send('Sign in successful!');
            }
          });
    })
 });






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