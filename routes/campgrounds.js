const express = require("express");
const router = require("express").Router();   
const Campground = require("../models/campground");     

// INDEX - show all campgrounds
router.get("/", (req, res) => {
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
  router.post("/", (req, res) => {
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
  // NEW - show form to create new campground
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  // SHOW - show more info about one campground
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    // find the campground with provided ID
    Campground.findById(id).populate("comments").exec( (err, foundCampsite) => {
      if (err) console.log(err);
  
      //render show template with that campground
      console.log(foundCampsite);
      res.render("campgrounds/show", {campsite : foundCampsite});
    });
    
  });
  
  module.exports = router;