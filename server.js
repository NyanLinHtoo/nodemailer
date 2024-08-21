const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/sendEmail", (req, res) => {
  const { name, email, selectedDate, selectedTime } = req.body;

  // Read the email template
  const emailTemplatePath = path.join(__dirname, "email.html");
  let emailHtml = fs.readFileSync(emailTemplatePath, { encoding: "utf-8" });

  // Replace placeholders with actual data
  emailHtml = emailHtml
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{dateAndTime}}", `${selectedDate} at ${selectedTime}`);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email, // Sender's email address
    to: process.env.MAIL_USERNAME,
    subject: "Booking Confirmation",
    html: emailHtml, // Use HTML template instead of plain text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("I am in error ");
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
