let mongoose                = require('mongoose');
let passportlocalmongoose   = require('passport-local-mongoose');
let userschema = new mongoose.Schema({
    username: String,
    password: String
});
userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model("user", userschema);