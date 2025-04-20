const mongoose = require("mongoose");
const dbcon = require("./MONGODB/dbcon.js");
const log = require("./Login.js");

const connectdb = new dbcon();
const userSchema = connectdb.schemaUser();
const signInProcess = new log();

class Rege {
  async process(req, res) {
    const creation_date = Math.floor(Date.now() / 1000); // Unix timestamp
    const user_status = 1;
    const career_maps = [];

    // Ensure database connection
    connectdb.connection();

    const User = mongoose.models.CareerWayFinder_users || mongoose.model("CareerWayFinder_users", userSchema,"CareerWayFinder_users");

    try {
      // Extract and validate input data
      const { full_name, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.redirect("/login");
      }

      // Create and save a new user document
      const newUser = new User({
        full_name,
        email,
        password,
        creation_date,
        user_status,
        career_maps,
      });

      await newUser.save();
      // Update request body for the sign-in process
      req.body = { email, password };

      // Use the login process to handle sign-in
      const token = await signInProcess.process(req, res);
      if (token) {
      res.cookie("auth_token", token, {
          httpOnly: true, // Secure cookie
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);

      if (error.name === "ValidationError") {
        // Handle Mongoose validation errors
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ error: validationErrors });
      }

      // Handle unexpected errors
      res.status(500).send("Error adding user.");
    }

  }
}

module.exports = Rege;
