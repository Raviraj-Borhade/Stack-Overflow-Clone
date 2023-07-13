const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Person", PersonSchema);
