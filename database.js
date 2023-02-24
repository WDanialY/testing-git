const mongoose = require('mongoose');

const urlDatabase = 'mongodb+srv://admin:xuBBGQUu73iD2uwV@test-1.2ykvs.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(urlDatabase, {useNewUrlParser: true});
 var conn = mongoose.connection;
 
 conn.on('connected', function(){
    console.log('connection acquired');
 });
 conn.on('disconnected', function(){
    console.log('database is disconnected');
 });
 conn.on('error', console.error.bind(console, 'connection error:'));

 module.exports = conn;