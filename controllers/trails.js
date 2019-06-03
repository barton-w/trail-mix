const express = require("express");
const router = express.Router();
const Trail = require("../models/Trail.js");
const errorResponse = "Oh no, an error occurred! Please try again";

//////////////////
////GET routes////
//////////////////
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
  console.log(request.body);
  response.send("POSTED!")
});

//Export router
module.exports = router;
