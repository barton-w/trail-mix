const express = require("express");
const router = express.Router();
const Trail = require("../models/Trail.js");
const errorResponse = "Oh no, an error occurred! Please try again";

//////////////////
////GET routes////
//////////////////
//Main page
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
//Route to a form to create a post
router.get("/add", (request, response) => {
  console.log(request.session.currentUser);
  if (request.session.currentUser) {
    response.render("trails/add.ejs");
  } else {
    response.redirect("/account/login");
  };
});
//Show route for individual posts
router.get("/view/:id", (request, response) => {
  let currentUser = "none";
  let currentUserName = "none";
  if (request.session.currentUser) {
    currentUser = request.session.currentUser;
    currentUserName = request.session.currentUserName;
  };
  Trail.find({_id: request.params.id}, (error, foundTrail) => {
    console.log(foundTrail[0].share);
    console.log(foundTrail[0].user);
    console.log(currentUser);
    if (error) {
      console.log(error);
      response.send(errorResponse);
    //Restricting access to un-shared posts when they don't belong to the logged-in user
    } else if (foundTrail[0].share === false && foundTrail[0].user !== currentUser) {
      response.redirect("/trails");
    } else {
      response.render("trails/show.ejs", {
        trail: foundTrail,
        currentUser: currentUser,
        currentUserName: currentUserName
      });
    };
  });
});
//Route to a form to edit an existing post
router.get("/edit/:id", (request, response) => {
  //If the user isn't logged in, they can't edit anything
  if (!request.session.currentUser) {
    response.redirect("/trails");
  } else {
    Trail.find({_id: request.params.id}, (error, foundTrail) => {
      if (error) {
        console.log(error);
        response.send(errorResponse);
      } else if (foundTrail[0].user !== request.session.currentUser) {
        response.redirect("/trails");
      } else {
        response.render("trails/edit.ejs", {
          trail: foundTrail
        });
      };
    });
  };
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

//////////////////
////PUT routes////
//////////////////
router.put("/edit/:id", (request, response) => {
  request.body.share === "on" ? request.body.share = true : request.body.share = false;
  Trail.updateOne({_id: request.params.id}, request.body, (error, updatedTrail) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      response.redirect("/trails");
    };
  });
});

//////////////////
///DELETE routes//
//////////////////
router.delete("/:id", (request, response) => {
  Trail.deleteOne({_id: request.params.id}, (error, deletedTrail) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      response.redirect("/trails");
    };
  });
});

//Export router
module.exports = router;