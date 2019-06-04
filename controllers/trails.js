const express = require("express");
const router = express.Router();
const Trail = require("../models/Trail.js");
const errorResponse = "Oh no, an error occurred! Please try again";

//////////////////
////GET routes////
//////////////////
router.get("/", (request, response) => {
  console.log(request.session.currentUser);
  console.log(request.session.currentUserName);
  let currentUser = "none";
  let currentUserName = "none";
  if (request.session.currentUser) {
    currentUser = request.session.currentUser;
    currentUserName = request.session.currentUserName;
  };
  //Selecting the most recent shared posts
  Trail.find({share: true}, (error, data) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      response.render("trails/index.ejs", {
        currentUser: currentUser,
        currentUserName: currentUserName,
        trails: data
      });
    };
  }).sort({createdAt: -1}).limit(10);
});
router.get("/add", (request, response) => {
  console.log(request.session.currentUser);
  if (request.session.currentUser) {
    response.render("trails/add.ejs");
  } else {
    response.redirect("/account/login");
  };
});
router.get("/view/:id", (request, response) => {
  response.send("VIEW A TRIAL");
});

//////////////////
////POST routes///
//////////////////
router.post("/add", (request, response) => {
  request.body.share === "on" ? request.body.share = true : request.body.share = false;
  request.body.user = request.session.currentUser;
  Trail.create(request.body, (error, createdTrail) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      response.redirect("/");
    };
  });
});

//Export router
module.exports = router;
