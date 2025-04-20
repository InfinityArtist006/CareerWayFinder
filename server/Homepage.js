const express = require("express");
const path = require("path");
const NodeCache = require("node-cache");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
// Custom modules
const dbcon = require("./MONGODB/dbcon.js");
const rege = require("./Register.js");
const log = require("./Login.js");
const middleware = require("./middleware.js");
const { message } = require("statuses");

const app = express();
const port = 3000;
const userReset = { email: "", token: "" };
app.use(cookieParser());

// Initialize custom classes and modules
const connectdb = new dbcon();
const signUpProcess = new rege();
const signInHandle = new log();
const middlewareSupport = new middleware();
const cache = new NodeCache();

// Middleware to parse form data
middlewareSupport.formData(app);

// Mongoose model for roadmaps
//const roadmapSchema = connectdb.schemaRoadmap();
const userReviewSchema = connectdb.schemaReview();
const userSchema = connectdb.schemaUser();
const review =
  mongoose.models.CareerWayFinder_reviews ||
  mongoose.model(
    "CareerWayFinder_reviews",
    userReviewSchema,
    "CareerWayFinder_reviews"
  );
const User =
  mongoose.models.CareerWayFinder_users ||
  mongoose.model("CareerWayFinder_users", userSchema, "CareerWayFinder_users");

// Serve static files for the homepage
app.use(express.static(path.join(__dirname, "../../Project CWF")));

// Routes
// Serve signup page
app.all("/Signup", async(req, res) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "../../Project CWF/signup.html"));
  } else if (req.method === "POST") {
    if(await middlewareSupport.verifyEmail(req.body.email)) {
      await signUpProcess.process(req, res);
      res.json();
    }else{
      res.json({message:"Email doesn't exist"});
    }
  }
});

// Serve signin page
app.all("/login", async (req, res) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "../../Project CWF/login.html"));
  } else if (req.method === "POST") {
    try {
      //console.log(req.body); //For debugging
      const token = await signInHandle.process(req, res); // Assume this returns a JWT on success
      //console.log(token); //For debugging
      if (token) {
        const { email } = token;
        // Set the JWT as a cookie and redirect to "/"
        res.cookie("auth_token", token, {
          httpOnly: true, // Secure cookie
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        await User.findOneAndUpdate({ email }, { $set: { user_status: 1 } }); // Update user status to 1
        res.json({}); //sending no error
      } else {
        res.json({ message: "Email and Password does not match" }); //sending error
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }
});

//fetch is the user is loggedin or not
app.get("/auth/status", (req, res) => {
  if (req.cookies.auth_token) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

//logout
app.post("/logout", async (req, res) => {
  const { email, password } = req.body;
  await User.findOneAndUpdate({ email }, { $set: { user_status: 0 } }); // Update user status to 0
  res.clearCookie("auth_token", { path: "/" }); // Ensure the path matches where the cookie was set
  res.redirect("/");
});

//Handle forgot password
app.all("/forgotpass", async (req, res) => {
  if (req.method == "GET") {
    res.sendFile(path.join(__dirname, "../../Project CWF/forgotpass.html"));
  } else if (req.method == "POST") {
    const { email } = req.body;
    //console.log("Email:", email);//Debugging

    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the token in backend
    userReset.email = email;
    userReset.token = resetToken;

    // Send reset email
    middlewareSupport.sendResetEmail(email, resetToken);

    res.json({});
  }
});

//reset password
app.all("/resetpassword", async (req, res) => {
  if (req.method == "GET") {
    res.sendFile(
      path.join(__dirname, "../../Project CWF/resetpasswordpage.html")
    );
  } else if (req.method == "POST") {
    const { email, token, newPassword } = req.body;
    //console.log(req.body);//Debugging
    const user = await User.findOne({ email: { $eq: email } });

    if (!user || userReset.token !== token) {
      return res.status(400).json({ message: "Invalid token or email" });
    }

    // new password and save it
    await User.findOneAndUpdate(
      { email: { $eq: email } },
      { $set: { password: newPassword } }
    );

    //unsetting the values
    userReset.email = "";
    userReset.token = "";

    res.json({});
  }
});

// Generate a path based on user input
app.post("/roadmap", async (req, res) => {
  const { CareerName } = req.body;
  //console.log("Career Name:", CareerName); //Debugging
  try {
    let recommendedJob = await connectdb.searchCareerData(CareerName);
    res.json({ roadmap: recommendedJob });
    // if (recommendedJob) {
    //   res.json({ roadmap: recommendedJob });
    // } else {
    //   recommendedJob = await roadmapAI.generateCareerData(careerTitle);
    //   res.json(JSON.parse({ roadmap: recommendedJob }));
    //   await User.insertOne(JSON.parse(recommendedJob));
    // }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add roadmap Id to career maps list
app.post("/roadmap/add", middlewareSupport.verifyToken, async (req, res) => {
  const { roadmapId } = req.body;
  //console.log(roadmapId); //for debugging
  const email = req.user.email;
  //console.log(email); //for debugging
  await User.findOneAndUpdate(
    { email },
    { $addToSet: { career_maps: roadmapId } }
  ); //add roadmap id in user career maps list
});

// User profile route
app.get("/profile", middlewareSupport.verifyToken, async (req, res) => {
  try {
    // Fetch user data using the verified token (req.user is set by middlewareSupport.verifyToken)
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Invalid user data in token." });
    }

    const userData = await connectdb.fetchProfileData(userEmail);

    //serving the html page
    if (!req.xhr && !req.headers.accept.includes("application/json")) {
      return res.sendFile(
        path.join(__dirname, "../../Project CWF/account.html")
      );
    }
    // Send user data
    res.json({ userData });
  } catch (err) {
    console.error("Error in /profile route:", err.message);
    res.status(500).send("An unexpected error occurred.");
  }
});

app.post(
  "/profile/myRoadmap",
  middlewareSupport.verifyToken,
  async (req, res) => {
    try {
      const { roadmapId } = req.body;
      //console.log(roadmapId); //for debugging
      if (!roadmapId) {
        return res.status(400).json({ error: "Missing roadmap ID." });
      }

      const roadmapData = await connectdb.profileRoadmapData(roadmapId);
      //console.log(roadmapData); //for debugging
      res.json({ roadmapData });
    } catch (err) {
      console.error("Error fetching roadmap data:", err.message);
      res.status(500).json({ error: "Failed to fetch roadmap data." });
    }
  }
);
//handles editing of credentials in profile (name)
app.post("/profile/myCredentials", async (req, res) => {
  const { name, email } = req.body;
  await User.findOneAndUpdate(
    { email: { $eq: email } },
    { $set: { full_name: name } }
  );
  res.json({ userCredentials: name });
});
//handles profile photo change
app.post("/profile/setprofileimage", async (req, res) => {
  const { image, email } = req.body;
  // console.log(email);//Debugging
  try{
  await User.findOneAndUpdate(
    { email: email }, // Find user by email
    { $set: { profile_image: image } }, // Add or update profile_image
    { new: true } // Return the updated document
  );
  res.json();
  }catch(error){
    res.json({ message: "Image file is too large please choose another image" });
  }
});
//User review
app.all("/review", middlewareSupport.verifyToken, async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.redirect("/login");
  }

  if (req.method === "GET") {
    return res.sendFile(path.join(__dirname, "../../Project CWF/review.html"));
  }

  if (req.method === "POST") {
    try {
      const review_date = Math.floor(Date.now() / 1000);
      const { full_name, email, suggestion } = req.body;
      console.log(req.body);

      if (!full_name || !email || !suggestion) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Insert review into the database
      const user_suggestion = new review({
        full_name,
        email,
        suggestion,
        review_date,
      });

      await user_suggestion.save();
      return res.redirect("/");
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
  return res.status(405).json({ error: "Method Not Allowed" });
});

//serve About us page
app.get("/aboutus", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../Project CWF/aboutus.html"));
});

//AI for recommending career
app.post("/recommendcareer", async (req, res) => {
  const { personality, interests, hobbies } = req.body;

  //Debugging
  // console.log(personality, interests, hobbies);
  // console.log("this is what i'm getting in my request:",req.body);

  if (!personality || !interests || !hobbies) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let careerSuggestions = await recommendAI.recommendCareer(
    personality,
    interests,
    hobbies
  );
  let recommendationBasedOnPersonaldata = [];
  for (careers in JSON.parse(careerSuggestions)) {
    recommendationBasedOnPersonaldata.push(careers.career);
  }
  let recommendCareer = await connectdb.searchCareerData(
    recommendationBasedOnPersonaldata
  );
  if (recommendCareer) {
    res.json({ roadmap: recommendCareer });
  } else {
    res.json(JSON.parse({ careers: careerSuggestions }));
    await User.insertMany(JSON.parse(careerSuggestions));
  }
});
//Error
app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, "../../Project CWF/Error.html"));
});
// Clear cache
cache.flushAll();
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
