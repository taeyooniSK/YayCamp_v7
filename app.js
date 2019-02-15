const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds");

    
mongoose.connect("mongodb://localhost/yay_camp_v6", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Something is something!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose 에서 오는 메소드
passport.serializeUser(User.serializeUser()); // passport-local-mongoose 에서 오는 메소드
passport.deserializeUser(User.deserializeUser()); // passport-local-mongoose 에서 오는 메소드

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
  // console.log(req.user);
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err){
      console.log(err);
    }
      res.render("campgrounds/index", { campsites: allCampgrounds});
  });
  
});

// CREATE - add new campground to DB
app.post("/campgrounds", (req, res) => {
  const name = req.body.name,
        image = req.body.image,
        description = req.body.description;

  const newCampground = { 
    name, 
    image,
    description 
  };

  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) console.log(err);

    res.redirect("/campgrounds");
  });
  // campgrounds.push(campground);
 

});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  const id = req.params.id;
  // find the campground with provided ID
  Campground.findById(id).populate("comments").exec( (err, foundCampsite) => {
    if (err) console.log(err);

    //render show template with that campground
    console.log(foundCampsite);
    res.render("campgrounds/show", {campsite : foundCampsite});
  });
  
});

// ======================================
// COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if(err) console.log(err);
      res.render("comments/new", {campground});
    });
    
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    // look up campground using ID
    Campground.findById(req.params.id, (err, campground) => {
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      } 
        Comment.create(req.body.comment, (err, comment) => {
          if(err) {
            console.log(err);
          } 
            campground.comments.push(comment);
            campground.save();
            res.redirect(`/campgrounds/${campground._id}`);
          
        });

    });
    // create new comment
    // connect new comment to campground
    // redirect campground show page
});

// ======================================

// AUTH ROUTES

// show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up logic
app.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => { // passport-local-mongoose pacakges에서 제공되는 메소드
    if(err){
      console.log(err);
      return res.render("register"); // short-circuit
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    })
  }); 
});

app.get("/login", (req, res) => {
  res.render("login");
});

// 이 패턴임 app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
 { 
    successRedirect : "/campgrounds",
    failureRedirect: "/login"
  }),(req, res) => {
    
});

// logout logic route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


app.listen(3000, () => {
  console.log("Server is listening to 3000 !");
});
