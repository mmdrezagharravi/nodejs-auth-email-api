const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { verify } = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, " name is required ."],
  },
  email: {
    type: String,
    required: [true, " email is require. "],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required . "],
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  // verificationToken: String,
  verificationCodeExpires: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.method.compearPassword = async function (condidatePassword) {
  return await bcrypt.compare(condidatePassword.password, this.password);
};

module.exports = mongoose.model("User", userSchema);
