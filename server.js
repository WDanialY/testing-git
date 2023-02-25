 const express = require("express");
 const bodyParser = require('body-parser');
 const path = require('path');
 const mongoose = require('mongoose');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 const nodemailer = require('nodemailer');
 const fs = require('fs');
 const config = require('./config');
 const cookieParser = require("cookie-parser");
 const app = express();

 const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 587,
   secure: false,
   auth: {
      user: 'danialyerzhigit@gmail.com',
      pass: config.emailPass,
   }
 });

 const port = process.env.PORT || 3000;
 const mongoUrl = process.env.MONGO_URL || `mongodb+srv://user123:${config.mongoUserPass}@test-1.2ykvs.mongodb.net/?retryWrites=true&w=majority`;

 mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Failed to connect to MongoDB', err));

 const userSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   fname: {type: String, required: true},
   lname: {type: String, required: true},
   password: { type: String, required: true },
   confirmed: { type: Boolean}
 });

 const User = mongoose.model('User', userSchema);

 app.use(express.static(__dirname + "/website"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(cookieParser());

 
 function cookieCheck(req){
   const token = req.cookie.token;
   if(token){
      try{
         const {email} = jwt.verify(token, '3141592653589793');
         req.user = email;
         return true;
      }catch (err){
         console.log(err);
      }
   }else{
      return false;
   }
 }

// # PAGE REQUEST

 app.get("/", function(req, res) {
      if(cookieCheck(req)){
         fs.readFile(__dirname + "/website/index.html", "utf-8", (err, data)=>{
            if (err){
               console.error(err);
               res.status(500).send("Internal Server Error");
               return;
            }

            data = data.replace('<a href="signin" class="signin">Войти</a>', "<p class='signin'>Подтвердите почту.</p>");
            res.send(data);
          });
      }else{
         res.sendFile(__dirname + "/index.html");
      }
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


//  # Sign Up Process

app.post("/signup", async (req, res) => {
   const { fname, lname, email, password, confPassword } = req.body;
   console.log(req.body);
   const saltRounds = 10;
   const user = await User.findOne({email});
   try{
      if(user){
         res.send("Email already in use");
      }else if(password.length < 8){
         res.send("Password cannot be accepted");
      }else if(password !== confPassword){
         res.send("Passwords do not match");
      }else{
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         const confirmationToken = jwt.sign({email}, '3141592653589793', {expiresIn: '24h'});

         const confimationUrl = `http://localhost:3000/confirm-email?token=${confirmationToken}`;
         const mailOptions = {
            from: "danialyerzhigit@gmail.com",
            to: email,
            subject: "Confirm your email",
            html: `<p>Click the link below to confirm your email address:</p><p><a href="${confirmationUrl}">${confirmationUrl}</a></p>`,
         }

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send("Error sending confirmation email");
            } else {
              console.log("Confirmation email sent: " + info.response);
              res.redirect(301, "/signin");
            }
          });
          const userReg = await User.create({email, fname, lname, password: hashedPassword, confirmed: false});

          fs.readFile(__dirname + "/website/template.html", "utf-8", (err, data)=>{
            if (err){
               console.error(err);
               res.status(500).send("Internal Server Error");
               return;
            }

            data = data.replace("<p></p>", "<p class='template_content'>Подтвердите почту.</p>");
            res.send(data);
          });
      }
   }catch (err){
      res.status(400).json({error: err.message});
   }
});


app.get("/confirm-email", async (req, res) => {
   const { token } = req.query;
   try {
     const { email } = jwt.verify(token, '3141592653589793');
     const user = await User.findOneAndUpdate({ email }, { confirmed: true });
     if (!user) {
       return res.status(400).send("Invalid confirmation link");
     }
     fs.readFile(__dirname + "/website/template.html", "utf-8", (err, data)=>{
      if (err){
         console.error(err);
         res.status(500).send("Internal Server Error");
         return;
      }

      data = data.replace("<p></p>", "<p class='template_content'>Почта подтверждена.</p>");
      res.send(data);
    });
   } catch (err) {
     console.error(err);
     res.status(400).send("Invalid confirmation link");
   }
 });



// # Sign In Process

app.post("/signin", async (req, res) => {
   const {email, password} = req.body;

   try{
      const user = await User.findOne({email});
      if(!user){
         return res.status(401).json({error: 'Invalid email or password 1'});
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match){
         return res.status(401).json({error: 'Invalid email or password 2'});
      }
      res.cookie('token', jwt.sign({email}, '3141592653589793'), {httpOnly: true});
      res.redirect('/');

   }catch (err){
      res.status(400).json({error: err.message});
   }
});




//  # LOCALHOST

 app.listen(port, function() {
     console.log("Localhost set on  port 3000");
 });