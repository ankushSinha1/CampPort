let express     = require('express'),
    router      = express.Router(),
    campground  = require('../models/campground'),
    comment     = require('../models/comment'),
    middleware  = require('../middleware/middleware')


//landing page
router.get("/", function(req, res){
    campground.find(function(err, data){
        if(err){
            req.flash("error", "Error loading page")
        }else{
            res.render("../views/campgrounds/landing", {campground: data});
        }
    })
})
//Create CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("../views/campgrounds/new");
});
router.post("/", middleware.isLoggedIn, function(req, res){
    let title = req.body.title;
    let price = req.body.price;
    let img = req.body.img;
    let caption = req.body.caption;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newcamp = {title: title, price: price, img: img, caption: caption, author: author}
    campground.create(newcamp, function(err, data){
        if(err){
            req.flash("error", "Couldn't post the campground");
            res.render("../views/campgrounds/new");
        }
        else{
            req.flash("success", "Campground  added!")
            res.redirect("/campgrounds");
        }
    })
})

//Read CAMPGROUND
router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comment").exec(function(err, data){
        if(err){
            req.flash("error", "Couldn't find your campground");
        }else{
            res.render("../views/campgrounds/show", {campground: data})
        }
    })
})

//Update CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
    campground.findById(req.params.id, function(err, data){
        res.render("../views/campgrounds/edit", {foundCamp: data});
    })
})
router.put("/:id", function(req, res){
    campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, data){
        if(err){
            req.flash("error", "Couldn't edit the campground");
            res.render("../views/campgrounds/edit", {foundCamp: data});
            
        }else{
            req.flash("success", "Campground  updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Couldn't delete the campground");
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground  deleted!")
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;