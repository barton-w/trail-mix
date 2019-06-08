//Establish dependencies and configuration
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const errorResponse = "Oh no, an error occurred! Please try again";

//////////////////
////GET routes////
//////////////////
//Create account
router.get("/create", (request, response) => {
  if (request.session.currentUser) {
    response.redirect("/trails");
  } else {
    response.render("account/create.ejs");
  };
});
//Log in
router.get("/login", (request, response) => {
  if (request.session.currentUser) {
    response.redirect("/trails");
  } else {
    response.render("account/login.ejs", {
      message: "none"
    });
  };
});
//Log out - doing this as a get because I don't need data from the user in order to log them out
router.get("/logout", (request, response) => {
  if (request.session.currentUser) {
    request.session.destroy(() => {
      response.redirect("/trails");
    });
  } else {
    response.redirect("/trails");
  };
});

//////////////////
////POST routes///
//////////////////
router.post("/create", (request, response) => {
  request.body.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
  User.create(request.body, (error, createdUser) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      request.session.currentUserName = createdUser.username;
      request.session.currentUser = createdUser._id;
      response.redirect("/trails");
    };
  });
});
router.post("/login", (request, response) => {
  User.findOne({username: request.body.username}, (error, foundUser) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else if (!foundUser) {
      response.render("account/login.ejs", {
        message: "We didn't find that username, please try again"
      });
    } else if (bcrypt.compareSync(request.body.password, foundUser.password)) {
      request.session.currentUserName = foundUser.username;
      request.session.currentUser = foundUser._id;
      response.redirect("/trails");
    } else {
      response.render("account/login.ejs", {
        message: "Incorrect password, please try again"
      });
    };
  });
});

//Export router
module.exports = router;
