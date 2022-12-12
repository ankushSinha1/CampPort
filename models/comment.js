let mongoose = require('mongoose');
let commentschema = new mongoose.Schema({
    text: String,
    author: 
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});
module.exports = mongoose.model("comment", commentschema);