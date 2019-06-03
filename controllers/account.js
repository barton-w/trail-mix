//Establish dependencies and configuration
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const errorResponse = "Oh no, an error occurred! Please try again";

//////////////////
////GET routes////
//////////////////
router.get("/new", (request, response) => {
  response.render("account/new.ejs");
});

//////////////////
////POST routes///
//////////////////
router.post("/", (request, response) => {
  request.body.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
  User.create(request.body, (error, createdUser) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      request.session.currentUserName = createdUser.username;
      request.session.currentUser = createdUser._id;
      response.redirect("/");
    };
  });
});

//Export router
module.exports = router;
