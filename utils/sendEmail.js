const { text } = require("express");
const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: "mahaabi01@gmail.com",
      pass: "cwanrdllelvqsoaw",
    },
  });
  const mailOption = {
    from: "Abilash Maharjan<mail.abilash@gmail.com>",
    to: data.email,
    subject: data.subject,
    text: data.text,
  };
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail