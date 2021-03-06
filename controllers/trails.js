//Establishing dependencies
const express = require("express");
const router = express.Router();
const Trail = require("../models/Trail.js");
const errorResponse = "Oh no, an error occurred! Please try again";
const moment = require("moment");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (request, file, callback) => {
//     callback(null, "./uploads/");
//   },
//   filename: (request, file, callback) => {
//     callback(null, new Date().toISOString()+file.originalname.replace(/ /g, "_"));
//   }
// });
// const upload = multer({storage: storage, limits: {
//   //10mb - I'm generous
//   fileSize: 1024 * 1024 * 10
// }});

//////////////////
////GET routes////
//////////////////
//Main page
router.get("/", (request, response) => {
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
      for (let i = 0; i < data.length; i++) {
        data[i].displayDate = moment(data[i].createdAt).format('MMMM Do YYYY');
      };
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
  if (request.session.currentUser) {
    response.render("trails/add.ejs", {
      currentUser: request.session.currentUser,
      currentUserName: request.session.currentUserName
    });
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
    if (error) {
      console.log(error);
      response.send(errorResponse);
    //Restricting access to un-shared posts when they don't belong to the logged-in user
    } else if (foundTrail[0].share === false && foundTrail[0].user !== currentUser) {
      response.redirect("/trails");
    } else {
      foundTrail[0].displayDate = moment(foundTrail[0].createdAt).format('MMMM Do YYYY');
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
          trail: foundTrail,
          currentUser: request.session.currentUser,
          currentUserName: request.session.currentUserName
        });
      };
    });
  };
});
//Route for authenticated users to view only their posts, whether shared or not
router.get("/your-trails/:id", (request, response) => {
  if (request.session.currentUser !== request.params.id) {
    response.redirect("/account/login");
  } else {
    Trail.find({user: request.params.id}, (error, data) => {
      if (error) {
        console.log(error);
        response.send(errorResponse);
      } else {
        for (let i = 0; i < data.length; i++) {
          data[i].displayDate = moment(data[i].createdAt).format('MMMM Do YYYY');
        };
        response.render("trails/user.ejs", {
          trails: data,
          currentUser: request.session.currentUser,
          currentUserName: request.session.currentUserName
        });
      };
    }).sort({createdAt: -1});
  };
});

//////////////////
////POST routes///
//////////////////
// router.post("/add", upload.single("image"), (request, response) => {
//   request.body.image = "/"+request.file.path;
//   request.body.share === "on" ? request.body.share = true : request.body.share = false;
//   request.body.user = request.session.currentUser;
//   request.body.username = request.session.currentUserName;
//   console.log(request.body);
//   Trail.create(request.body, (error, createdTrail) => {
//     if (error) {
//       console.log(error);
//       response.send(errorResponse);
//     } else {
//       response.redirect("/trails");
//     };
//   });
// });
router.post("/add", (request, response) => {
  request.body.share === "on" ? request.body.share = true : request.body.share = false;
  request.body.user = request.session.currentUser;
  request.body.username = request.session.currentUserName;
  Trail.create(request.body, (error, createdTrail) => {
    if (error) {
      console.log(error);
      response.send(errorResponse);
    } else {
      response.redirect("/trails");
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
