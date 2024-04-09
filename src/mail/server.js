const nodemailer = require("nodemailer");
const { generateSnowflake } = require("../db");
require("dotenv").config({path: ".env.local"});
const express = require("express");
const cors = require("cors");


const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465, // Zoho uses port 465 for SSL
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'contact.eventsync@gmail.com', // username for your mail server
            pass: process.env.MAIL_PASSWORD, // password
        },
    }
);


const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL }));

app.post("/send-verification-email", async (req, res) => {
    let verificationCode = generateSnowflake();
    // Get last 5 digits of snowflake

    verificationCode = verificationCode.toString().slice(-5);

    const userEmail = req.body["email"];
    const userName = req.body["username"];
    
    const mailOptions = {
        from: "EventSync <contact@eventsync.app>",
        to: userEmail,
        subject: 'EventSync Verification Code',
        html: `<div style="border-radius:15px;text-align:center;background:#111926;font-family:'Lato',sans-serif;color:white;padding-top:50px;padding-bottom:50px"> <img src="https://cdn.discordapp.com/attachments/1209232299288170597/1227091242710732920/Logo.png?ex=662724c6&is=6614afc6&hm=7c0ad357cd61ff661b500e90303559f3fce835d82f07570e02238afc972e7d80&" style="width:150px"> <br><div style="margin:40px auto auto;background:#1f2836;border-radius:10px;padding:20px;border:1px solid #374050;max-width:800px"> <h1 style="font-weight:normal;line-height:10px">Hello <strong>${userName}</strong>!</h1> <h3 style="font-weight:normal">Your Signup Code is: <strong>${verificationCode}</strong></h3> <p style="color:gray;line-height:25px"> You, or someone using your email, has signed up for Event Sync<br>If you did not sign up, please ignore this email. </p></div></div>`
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send({message: "Error sending email"});
        } else {
            console.log('Email sent: ' + info.response);
            res.send({message: verificationCode});
        }
    });
});

app.listen(3001, () => {
    console.log('HTTPS Server running on port 443');
});



