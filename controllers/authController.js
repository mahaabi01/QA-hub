const { users, questions } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.renderHomePage = async (req, res) => {
  const { success } = req.flash("success");
  const data = await questions.findAll({
    include: [
      {
        model: users,
      },
    ],
  });
  res.render("home.ejs", { data, success });
};

exports.renderRegisterPage = (req, res) => {
  res.render("auth/register");
};

exports.renderLoginPage = (req, res) => {
  const [error] = req.flash("error");
  res.render("auth/login", { error });
};

exports.getUsers = async (req, res) => {
  const data = await users.findAll();
  res.json({
    data,
  });
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide email, password");
  }
  //email check
  const [data] = await users.findAll({
    where: {
      email: email,
    },
  });
  if (data) {
    //checking of password

    const isMatched = bcrypt.compareSync(password, data.password);

    //login the user if isMatch is true
    if (isMatched) {
      const token = jwt.sign({ id: data.id }, "password", { expiresIn: "30d" });
      res.cookie("jwttoken", token);
      // console.log("token:",token);
      // res.send("Logged in success.");
      req.flash("success", "Logged in successfully.");
      res.redirect("/");
    } else {
      req.flash("error", "Invalid email/password");
      res.redirect("/login");
    }
  } else {
    res.flash("error", "No user with that email.");
    res.redirect("/login");
  }
};

exports.handleRegister = async (req, res) => {
  const { username, password, email } = req.body; 
  if (!username || !password || !email) {
    return res.send("Please provide username, email, password.");
  } //basic server side validation

  const data = await users.findAll({
    where: {
      email: email,
    },
  });
  if (data.length > 0) {
    return res.send("Already register email.");
  }

  await users.create({
    email, // if key value same this is enough
    password: bcrypt.hashSync(password, 10), //bcrypt is used for hashing purpose
    username,
  });
  // res.send("Registered successfully !");
  res.redirect("/login");
};

exports.renderForgotPasswordPage = (req, res) => {
  res.render("./auth/forgotPassword");
};

exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(Math.random() * 1000, 9999);

  //send that otp to above incoming email
  sendEmail({
    email: email,
    subject: "Your reset password OTP",
    text: `Your otp is ${otp}`,
  });
  data[0].otp = otp;
  data[0].otpGeneratedTime = Data.now();
  await data[0].save();

  req.redirect("/verifyOtp?email=" + email);
};

exports.renderVerifyOtpPage = (req, res) => {
  const email = req.query.email;
  res.render("./auth/verifyOtp", { email: email });
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  email = req.params.id;
  const data = await users.findAll({
    where: {
      otp: otp,
      email: email,
    },
  });
  if (data.lendth === 0) {
    return res.send("Invalid OTP");
  }
  const currentTime = Data.now();
  const otpGeneratedTime = data[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    res.redirect(`/resetPassword?email=${email}&otp=${otp}`);
  } else {
    res.send("OTP expired !");
  }
};

exports.renderResetPassword = async (req, res) => {
  const { email, otp } = req.query;
  if (!email || !otp) {
    return res.send("Please provide email, otp in query");
  }
  res.render("./auth.resetPassword", { email, otp });
};

exports.handleResetPassword = async (req, res) => {
  const { email, otp } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!email || !otp || !confirmPassword) {
    return res.send("Please provide email,otp, newPassword, confirmPassword.");
  }
  if (newPassword !== confirmPassword) {
    return res.send("New Password must match confirm password.");
  }
  const userData = users.findAll({
    where: {
      email,
      otp,
    },
  });
  const currentTime = Data.now();
  const otpGeneratedTime = userData[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    await users.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.redirect("/login");
  } else {
    res.send("Otp expired !!");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.redirect("/login");
};
