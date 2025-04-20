
# CareerWayFinder

CareerWayFinder is an interactive web-based platform designed to help individuals explore career options, educational paths, and professional milestones. The app provides a comprehensive roadmap of career journeys, from academic streams and courses to the professional skills and steps required to succeed in various careers. It is intended for anyone looking to plan their career path with detailed guidance and suggestions based on their interests and goals.

## Features

- **Interactive Career Maps**: Explore different career paths and understand what steps you need to take to succeed.
- **Career Timelines**: Get an overview of the educational and professional milestones in various careers.
- **Personalized Recommendations**: Based on user inputs, the app suggests relevant academic streams, college courses, and exams.
- **Comprehensive Career Data**: Learn about salary ranges, career advancement opportunities, related careers, and professional communities.
- **User Reviews**: Users can share their experiences, feedback, and suggestions on different career paths.

## Tech Stack

- **Front-End**: 
  - HTML 5
  - Bootstrap 5.3
  - SCSS 1.77.8
- **Back-End**:
  - Node.js 23.4.0
  - Express.js 4.19.2
- **Database**: 
  - MongoDB 8

## Project Structure

- **/public**: Static files like images, stylesheets, and JavaScript.
- **/routes**: Express.js route handlers for different API endpoints.
- **/models**: MongoDB models for `CareerRoadmaps`, `Careerwayfinder_users`, and `Careerwayfinder_reviews`.
- **/views**: HTML templates for rendering career maps, user feedback, etc.
- **/controllers**: Logic for processing and handling user requests.

## Database Schema

### CareerRoadmaps

- **_id**: Unique MongoDB ObjectId
- **core_career**: Main career category
- **roadmap_id**: Unique identifier for the roadmap
- **academic_stream**: Relevant academic streams
- **career**: Specific career name
- **description**: Overview of the career
- **college_course**: Relevant courses for the career
- **duration**: Time needed to establish the career
- **exam_name** (Optional): Entrance exams for the career
- **subjects**: Core subjects needed for the career
- **steps**: Stages of career progression
- **salary_range**: Entry-level to experienced salary ranges
- **advancement_opportunities**: Career growth potential
- **related_careers**: Similar career paths
- **professional_community**: Related professional groups
- **entry_requirements**: Academic prerequisites
- **related_books**: Books related to the career

### Careerwayfinder_users

- **_id**: Unique identifier
- **full_name**: User's full name
- **email**: User's email (unique)
- **password**: Hashed password
- **creation_date**: Account creation timestamp
- **user_status**: Account status (active/inactive)
- **career_maps**: Array of roadmap_ids
- **__v**: Version key (MongoDB)

### Careerwayfinder_reviews

- **_id**: Unique identifier
- **email**: User's email
- **full_name**: User's full name
- **suggestion**: Review or feedback
- **post_time**: Timestamp of review submission

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/InfinityArtist006/CareerWayFinder.git
   ```

2. Navigate to the project folder:

   ```bash
   cd CareerWayFinder
   ```

3. Install dependencies:

   ```bash
   npm install
   ```
   Run this Commmand in "Project CWF\server" and "CWF DASHBOARD\JS".

5. Start the application:

   ```bash
   node Project CWF\server\Homepage.js
   node CWF DASHBOARD\JS\Admin.js
   ```
6. Visit the User Dashboard at `https://localhost:5000`.
   Visit The Admin panel at `https://localhost:3000`

7. Database configure :
   Must check Mongodb Connection String before running project inside `Project CWF\server\MONGODB\dbcon.js`
   Also check `CWF DASHBOARD\JS\Admin.js`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
