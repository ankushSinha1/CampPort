let app                     = require('express')(),
    bodyparser              = require('body-parser'),
    mongoose                = require('mongoose'),
    mo                      = require('method-override'),
    passport                = require('passport'),
    localStrategy           = require('passport-local'),
    campground              = require('./models/campground.js'),
    Comment                 = require('./models/comment.js'),
    user                    = require('./models/user.js'),
    flash                   = require('connect-flash');

let campRoutes              = require('./routes/campground.js'),
    commentRoutes           = require('./routes/comment.js')
    authRoutes              = require('./routes/auth.js')

mongoose.connect("mongodb+srv://Ankush123:Ankush123@campportdatabase.ydn8cjc.mongodb.net/?retryWrites=true&w=majority");

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('trust proxy', 1);
app.use(mo("_method"));
app.use(require('express').static(__dirname + "/public"))
app.use(flash());

//setting AUTH
app.use(require('cookie-session')({
    cookie:{
        secure: true,
        maxAge: 24*60*60*1000
    },
    secret: "First project on webdev",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds",campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//PORT config
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started...");
})