let campground      = require('../models/campground'),
    comment         = require('../models/comment')

    let middleware =  {
        isLoggedIn: function(req, res, next){
            if(req.isAuthenticated()){
                return next();
            }
            req.flash("error", "You must be logged in to be able to proceed!")
            res.redirect("/login");
        },
    checkCampgroundOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            campground.findById(req.params.id, function(err, foundCamp){
                if(err){
                    req.flash("error", "Couldn't find your campground")
                    res.redirect("back")
                }
                else{
                    if(foundCamp.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error", "You're not authorized to do that!")
                        res.redirect("back");
                    }
                }
            })
        }else{
            req.flash("error", "You must be logged in to be able to proceed!")
            res.redirect("/login")
        }
    },
    checkCommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            comment.findById(req.params.comment_id, function(err, data){
                if(data.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Couldn't find your comment")
                    res.redirect("back");
                }
            })
        }else{
            req.flash("error", "You must be logged in to be able to proceed!")
            res.redirect("/login");
        }
    }
}
module.exports = middleware;