const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

class DBConnection {
  async connect() {
    const mongoURI =
      "localhost:27017/CareerWayFinder_db";
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  }

  schemaUser() {
    return new mongoose.Schema({
      full_name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      creation_date: { type: Number, required: true },
      user_status: { type: Number, required: true },
      career_maps: { type: [String], default: [] },
    });
  }

  schemaRoadmap() {
    return new mongoose.Schema({
      core_career: { type: String, required: true },
      roadmap_id: { type: String, required: true },
      academic_stream: { type: String, required: true },
      career: { type: String, required: true },
      description: { type: String, required: true },
      college_course: { type: String, required: true },
      duration: { type: String, required: true },
      subjects: { type: [String], required: true },
      hashtags: { type: [String], required: true },
      steps: [
        {
          stage: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      institutions: { type: [String], required: true },
      salary_range: {
        entry_level: { type: String, required: true },
        experienced: { type: String, required: true },
      },
      advancement_opportunities: { type: [String], required: true },
      related_careers: { type: [String], required: true },
      professional_community: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      entry_requirements: { type: [String], required: true },
      related_books: [
        {
          title: { type: String, required: true },
          author: { type: String, required: true },
          isbn: { type: String, required: true },
        },
      ],
    });
  }

  schemaReview() {
    return new mongoose.Schema({
      RWID: { type: String, required: true },
      full_name: { type: String, required: true },
      email: { type: String, required: true },
      suggestion: { type: String, required: true },
      post_time: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    });
  }
}

const app = express();
const db = new DBConnection();

app.use(cors());
app.use(bodyParser.json());
db.connect();
app.use(express.static(path.join(__dirname, "../../CWF DASHBOARD")));

const User = mongoose.model(
  "CareerWayFinder_users",
  db.schemaUser(),
  "CareerWayFinder_users"
);
const CareerData = mongoose.model(
  "CareerRoadmaps",
  db.schemaRoadmap(),
  "CareerRoadmaps"
);
const Review = mongoose.model(
  "CareerWayFinder_reviews",
  db.schemaReview(),
  "CareerWayFinder_reviews"
);

app.get("/api/stats", async (req, res) => {
  try {
    const data = {
      activeUsers: await User.countDocuments({ user_status: 1 }),
      totalUsers: await User.countDocuments(),
      totalPaths: await CareerData.countDocuments(),
    };
    res.json({ data });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select(
      "full_name email creation_date user_status career_maps"
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/roadmaps", async (req, res) => {
  try {
    const roadmaps = await CareerData.find().select(
      "roadmap_id core_career academic_stream career"
    );
    res.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().select(
      "RWID full_name email suggestion post_time"
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/reviews/count", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    res.json({ totalReviews });
  } catch (error) {
    console.error("Error fetching total reviews count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/reviews/:RWID", async (req, res) => {
  const { RWID } = req.params;

  try {
    const deletedReview = await Review.findOneAndDelete({ RWID });
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/roadmaps/:roadmap_id", async (req, res) => {
  try {
    const { roadmap_id } = req.params;

    const deletedRoadmap = await CareerData.findOneAndDelete({ roadmap_id });

    if (!deletedRoadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.status(200).json({ message: "Roadmap deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting roadmap:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
