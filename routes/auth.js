let express     = require('express'),
router          = express.Router(),
passport        = require('passport'),
user            = require('../models/user');

//HOMEPAGE
router.get("/", function(req, res){
    res.render("../views/auth/home");
})

//REGISTER route
router.get("/register", function(req, res){
    res.render("../views/auth/register");
})
router.post("/register", function(req, res){
    let newuser = new user({username: req.body.username}),
        hash    = req.body.password
    user.register(newuser, hash, function(err, data){
        if(err){
            console.log(err)
            req.flash("error", err.message)
            return res.render("../views/auth/register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to CampPort @" + req.body.username)
            res.redirect("/campgrounds");
        })
    })
})

//LOGIN route
router.get("/login", function(req, res){
    res.render("../views/auth/login");
})
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        successFlash: "Welcome Back!",
        failureRedirect: "/login",
        failureFlash: "Couldn't log you in"
    }
    ),function(req, res){
});

//LOGOUT route
router.get("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }
    });
    req.flash("success", "Logged out successfully")
    res.redirect("/campgrounds");
})

module.exports = router;