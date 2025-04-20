const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

const dbcon = require("./MONGODB/dbcon.js");

const connectdb = new dbcon();
connectdb.connection();

class Middleware {
  /**
   * Middleware for handling form data
   */
  formData(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
  //middleware to generate auth token
  generateToken(user) {
    const payload = {
      email: user.email,
    };
    const secret = process.env.JWT_SECRET || "Security No.1";
    const options = {
      expiresIn: "30d", // Token validity
    };
    return jwt.sign(payload, secret, options);
  }

  //middleware to creaate SMTP
  createTransport() {
    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or use a custom SMTP provider
      auth: {
        user: "bronled83@gmail.com", // Your email
        pass: "biwf dldi vcbp depa", // Your email app password (use an App Password, not your real password)
      },
    });
    return transporter;
  }

  /**
   * Middleware to verify JWT tokens
   */
  verifyToken(req, res, next) {
    try {
      // Extract token from cookies or Authorization header
      const token =
        req.cookies?.auth_token ||
        (req.headers.authorization?.startsWith("Bearer ") &&
          req.headers.authorization.split(" ")[1]);

      if (!token) {
        return res.redirect("/login");
      }

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "Security No.1"
      );
      // Attach user info to request object
      req.user = decoded;

      // Proceed to next middleware or route handler
      next();
    } catch (err) {
      console.error("Error verifying token:", err.message);

      const status = err.name === "TokenExpiredError" ? 401 : 403;
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Invalid token.";

      return res.status(status).json({ message });
    }
  }
  // Function to send a password reset email
  async sendResetEmail(toEmail, resetToken) {
    const transporter = this.createTransport();
    // const resetLink = `http://yourdomain.com/resetpassword?token=${resetToken}`;
    //console.log(resetToken);//Debugging
    const mailOptions = {
      from: '"Career Way Finder" <your-email@gmail.com>',
      to: toEmail,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.Enter the token given below in the reset page</p>
           <p>${resetToken}</p>
           <p>If you did not request this, please ignore this email.</p>`,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      //console.log("Email sent:", info.response);//Debugging
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  //Email checker
  async verifyEmail(email) {
    try {
        const response = await axios.get(`https://isitarealemail.com/api/email/validate`, {
            params: { email },
            headers: { Authorization: "Bearer free" }, // No API key required
        });
  
        if (response.data.status === "valid") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
  }
  
}
module.exports = Middleware;
