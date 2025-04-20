const mongoose = require("mongoose");
const DbCon = require("./MONGODB/dbcon.js");
const Middleware = require("./middleware.js");

const connectDb = new DbCon();
const userSchema = connectDb.schemaUser();
const middlewareSupport = new Middleware();

class Log {
  async process(req, res) {
    try {
      //connectDb.connection();
      const User = mongoose.models.CareerWayFinder_users  || mongoose.model("CareerWayFinder_users", userSchema,"CareerWayFinder_users");
      //console.log(req.body); //For debugging
      const { email, password } = req.body;

      const USER = await User.findOne({ email });
      if (!USER) {
        return false;
      }

      if (USER.password === password) {
        
        // Generate JWT
        const token = middlewareSupport.generateToken(USER);
        return token;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error during process execution:", error);
      return res.status(500).send("An error occurred during the process.");
    }
  }
}

module.exports = Log;