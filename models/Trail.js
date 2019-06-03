//Establish Trail schema
const mongoose = require("mongoose");
const trailSchema = new mongoose.Schema({
  trail_name: {type: String, required: true},
  location: {type: String, required: true},
  trail_features: {type: [String], required: true},
  share: {type: Boolean, required: true},
  image: String,
  condtions: String,
  exposure: String,
  route: String,
  distance: String,
  elevation_gain: String,
  diffuculty: String,
  wildlife: String,
  flora: String,
  notes: String,
  user: {type: String, required: true}
}, {timestamps: true});
const Trail = mongoose.model("Trail", trailSchema);

//Export Trail
module.exports = Trail;
