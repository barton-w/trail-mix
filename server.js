//App dependencies and controllers
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();

//Configuration
const port = process.env.PORT;
const mongodbURI = process.env.MONGODB_URI;

//Middleware handlers
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "$O0F@DffJ7$d#WWBm4T",
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride("_method"));

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

//Routes
app.get("/", (request, response) => {
  response.send("HELLO WORLD");
});
