const express = require("express");
const router = require("express").Router();    
const passport = require("passport");
const User = require("../models/user");    

//root
router.get("/", (req, res) => {
    res.render("landing");
  });

// show register form
router.get("/register", (req, res) => {
    res.render("register");
  });
  
  // handle sign up logic
  router.post("/register", (req, res) => {
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
  // show login form
  router.get("/login", (req, res) => {
    res.render("login");
  });
  
  // handling login logic 이 패턴임 app.post("/login", middleware, callback)
  router.post("/login", passport.authenticate("local",
   { 
      successRedirect : "/campgrounds",
      failureRedirect: "/login"
    }),(req, res) => {
      
  });
  
  // logout route
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
  });
  
  // middleware
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  };

  module.exports = router;