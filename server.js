//App dependencies and controllers
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const accountController = require("./controllers/account.js");
const trailsController = require("./controllers/trails.js");

//Configuration
const port = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODB_URI || "mongodb://localhost/trail_mix";

//Middleware handlers
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "$O0F@DffJ7$d#WWBm4T",
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride("_method"));
// app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use("/account", accountController);
app.use("/trails", trailsController);

//MongoDB configuration and connection
mongoose.set("useFindAndModify", false);
mongoose.connect(mongodbURI, {useNewUrlParser: true});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

//Commence listening
app.listen(port, () => {
  console.log("App listening on port:", port);
})

//Redirect to /trails
app.get("/", (request, response) => {
  response.redirect("/trails");
});
