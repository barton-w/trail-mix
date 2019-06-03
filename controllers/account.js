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

//Export router
module.exports = router;
