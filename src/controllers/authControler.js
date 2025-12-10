const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../services/emailService");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send(400).json({
        success: false,
        message: "این ایمیل قبلا ثبت شده است .",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    await emailService.sendWelcomeEmail(email, name);

    await emailService.sendVerificationEmail(email, verificationToken);

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "ثبت نام موفق . ایمیل تایید ارسال شد .",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
