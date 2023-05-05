const mongoose = require("mongoose");

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  confirmPass: String,
  phoneNumber: String,
});


module.exports = User