let express     = require('express'),
    router      = express.Router({mergeParams: true}),
    campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware/middleware')

//Create COMMENTS
router.get("/new", middleware.isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        }else{
            res.render("../views/comments/comments_new", {campground: data});
        }
    })
})
router.post("/", middleware.isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, data){
                if(err){
                    req.flash("error", "Couldn't post your comment");
                    res.redirect("/new");
                }else{
                    // console.log(req.user)
                    data.author.id = req.user._id
                    data.author.username = req.user.username;
                    data.save();
                    camp.comment.push(data);
                    camp.save();
                    req.flash("success", "Comment added!")
                    res.redirect("/campgrounds/" + camp._id);
                }
            })
        }
    })
})
//The process 'Read COMMENTS' is already performed when a single campground is selected

//Update COMMENTS
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Couldn't find your comment");
            res.redirect('back');
        }else{
            res.render("../views/comments/comment_edit", {comment: foundComment, camp_id: req.params.id});
        }
    })
})
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.cmt, function(err, data){
        if(err){
            req.flash("error", "Couldn't edit your comment")
            res.redirect("back")
        }else{
            req.flash("success", "Comment updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete COMMENTS
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Couldn't delete your comment");
            res.redirect("back")
        }else{
            req.flash("success", "Comment deleted!")
            res.redirect("back");
        }
    })
})

module.exports = router;