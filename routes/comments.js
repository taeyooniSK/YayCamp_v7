const express = require("express");
const router = require("express").Router({mergeParams: true});  
const Campground = require("../models/campground");    
const Comment = require("../models/comment");      

// Comments new
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if(err) console.log(err);
      res.render("comments/new", {campground});
    });
    
});


// Comments Create
router.post("/", isLoggedIn, (req, res) => {
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
          // add username and id to comment
            comment.author.id = req.user._id;  // comment model에 따름
            comment.author.username = req.user.username;
          // console.log("New comment's username will be : " + req.user.username);
          // save comment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            console.log(comment);
            res.redirect(`/campgrounds/${campground._id}`);
          
        });

    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;