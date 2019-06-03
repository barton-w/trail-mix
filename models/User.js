//Establish User schema
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})
const User = mongoose.model("User", userSchema);

//Export User
module.exports = User;
