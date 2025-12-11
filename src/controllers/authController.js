const User = require("../models/User");
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

    const verificationCode = emailService.generateCode();

    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000,
    });

    await emailService.sendWelcomeWithCode(email, name, verificationCode);

    res.status(201).json({
      success: true,
      message: "ثبت نام موفق! کد تایید به ایمیل شما ارسال شد",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "شما ثبت نام نکردید .",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: "کد وارد شده اشتباه است .",
      });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "کد منقضی شده است . ",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "ایمیل شما با موفقیت تایید شد . :) ",
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

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await user.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربر یافت نشد",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "ایمیل قبلا تایید شده .",
      });
    }

    const newCode = emailService.generateCode();
    user.verificationCode = newCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    await emailService.resendCode(email, newCode);
    res.status(200).json({
      success: true,
      message: "کد جدید ارسال شد .",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "ایمیل و پسورد الزامی است . ",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ایمیل وارد شده صحیح نمیباشد یا ثبت نام نکرده اید /",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "زمز وارد شده اشتباه است . ",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "لطفا ابتدا ایمیل خود را تایید کنید . :)ّ",
      });
    }
    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: " ورود موفق . ",
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
