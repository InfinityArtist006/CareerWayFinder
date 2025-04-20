const mongoose = require("mongoose");

class dbcon {
  async connection() {
    const mongoURI =
      "localhost:27017/CareerWayFinder_db"; // Replace with your MongoDB URI
    mongoose
      .connect(mongoURI, {})
      .then(() => console.log("MongoDB Connected"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }
  schemaUser() {
    const userSchema = new mongoose.Schema({
      profile_image : {type: String},
      full_name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      creation_date: { type: Number, required: true },
      user_status: { type: Number, required: true },
      career_maps: { type: [String] },
    });
    return userSchema;
  }
  schemaRoadmap() {
    const CareerSchema = new mongoose.Schema({
      core_career: { type: String, required: true },
      roadmap_id: { type: String, required: true },
      academic_stream: { type: String, required: true },
      career: { type: String, required: true },
      description: { type: String, required: true },
      college_course: { type: String, required: true },
      duration: { type: String, required: true },
      exam_name_optional: { type: String }, // Optional field
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
          type: { type: String, required: true },
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
    return CareerSchema;
  }
  async fetchDataReview() {
    const userReviewSchema = this.schemaReview();
    try {
      const reviewDB = mongoose.models.CareerWayFinder_reviews || mongoose.model("CareerWayFinder_reviews", userReviewSchema,"CareerWayFinder_reviews");
      const reviewNumber = await reviewDB.countDocuments();
      const reviews = await reviewDB.find();
      const review = { TotalNumber: reviewNumber, FetchedReviews: reviews };
      return review;
    } catch (err) {
      console.error("Error fetching reviews: ", err);
    }
  }
  async searchCareerData(userInput) {
    const roadmapSchema = this.schemaRoadmap();
    try {
        const Roadmap = mongoose.models.CareerRoadmaps || mongoose.model("CareerRoadmaps", roadmapSchema, "CareerRoadmaps");

        // Check all documents in the database
        //const allData = await Roadmap.find({});
        //console.log("All Roadmap Data:", allData);

        // Debugging: Check MongoDB Connection
        //console.log("Mongoose Connection State:", mongoose.connection.readyState);

        // Ensure case-insensitive, partial search
        const query = {
            $or: [
                { career: { $regex: userInput, $options: "i" } },
                { hashtags: { $regex: userInput, $options: "i" } },
                { subjects: { $regex: userInput, $options: "i" } }
            ],
        };

        //console.log("Executing Query:", query);

        const results = await Roadmap.find(query);
        //console.log("Search Results:", results);

        return results;
    } catch (error) {
        console.error("Error searching career data:", error);
        return { error: "Internal server error. Please try again later." };
    }
}

  async profileRoadmapData(roadmapid) {
    const userSchema = this.schemaUser();
    try {
      const roadmapIdFetch = mongoose.models.CareerRoadmaps ||mongoose.model("CareerRoadmaps",userSchema,"CareerRoadmaps");
      const roadmapId = await roadmapIdFetch
        .find({ roadmap_id: { $eq: roadmapid } })
        .select("career core_career academic_stream");
      return roadmapId[0];
    } catch (error) {
      console.log(`Error fetching roadmap using ${roadmapid}`, error);
    }
  }
  schemaReview() {
    const userReviewSchema = new mongoose.Schema({
      full_name: { type: String, required: true },
      email: { type: String, required: true },
      suggestion: { type: String, required: true },
      review_date: { type: Number, required: true },
    });
    return userReviewSchema;
  }
  async fetchProfileData(email) {
    const userSchema =  this.schemaUser();
    try {
      // Get the user model, prevent recompilation
      const User = mongoose.models.CareerWayFinder_users || mongoose.model("CareerWayFinder_users",userSchema,"CareerWayFinder_users");
  
      // Ensure email is in lowercase to avoid case-sensitive issues
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        console.warn(`No user found for email: ${email}`);
        return null;
      }
  
      return user;
    } catch (err) {
      console.error("Error fetching profile data:", err.message);
      return null;
    }
  }
  
}
module.exports = dbcon;
