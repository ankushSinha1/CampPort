let mongoose = require('mongoose');
let campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    img: String,
    caption: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }, 
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});
module.exports = mongoose.model("campground", campgroundSchema);