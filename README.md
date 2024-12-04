
# AI Quizzer Backend

This project is a backend microservice for managing AI-driven quizzes, built with the following technologies:

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Authentication**: JWT (via `jose` library)
- **Database**: MongoDB
- **Caching**: Redis Upstash
- **APIs**:
  - **Resend API**: For email notifications
  - **OpenAI API**: For quiz generation, evaluation, and feedback
- **Encryption**: Password hashing using bcrypt
- **Hosting**: AWS EC2


## API Documentation
## All Bonus Task Are Also Completed

Comprehensive API documentation is available on Postman:  
[Postman API Documentation](https://documenter.getpostman.com/view/36764619/2sAYBUCrZn) - https://documenter.getpostman.com/view/36764619/2sAYBUCrZn

YouTube Video Link: (https://youtu.be/5yOxcS3i4fk)

Docker Image: https://hub.docker.com/r/divpatel05/aiquizzer

## Key Features

1. **JWT Authentication**  
   Secure login and user authentication using JSON Web Tokens.

2. **AI Quiz Management**  
   - Dynamic quiz generation with AI.  
   - Submission and automated evaluation.  
   - Retrieval of quiz history with advanced filters.  

3. **Email Notifications**  
   Sends quiz results and performance suggestions via email.

4. **Caching**  
   Quiz data retrieval is optimized with Upstash Redis for reduced API latency.

5. **Password Security**  
   Passwords are securely hashed with bcrypt for robust security.

## Hosting Details

The project is hosted on an AWS EC2 instance.  
API Base URL: [http://project0x.org/api/](http://project0x.org/api/)

## Technologies Used

- **Next.js** (App Router for routing)
- **TypeScript** (Static typing)
- **MongoDB** (Schema design and data storage)
- **Upstash Redis** (Caching layer)
- **Resend API** (Email service)
- **OpenAI API** (AI-driven quiz features)
- **bcrypt** (Password hashing)
- **Hosting** (AWS EC2)
- **Docker & Docker Hub** (For Docker image)
- 

## Project Structure

- **`src/app/api`**: Contains all the API endpoints.
  - Handles routes for authentication, quiz management, and result retrieval.

- **`src/model`**: MongoDB schema definitions.
  - **Users**: Schema for storing user details.
  - **Quiz**: Schema for quiz metadata.
  - **Submission**: Schema for storing quiz submissions and their scores.

  
- **`src/helpers`**: Utility files to manage common tasks.
  - `generateQuestion.ts`: Logic for generating quiz questions using AI.
  - `sendAnalyticalEmail.ts`: Sends statistics and quiz reports.
  - `sendVerificationEmail.ts`: Sends verification email for user authentication.


- **`root/emails`**: Contains email templates for sending various notifications, such as stastics emails and verification emails.


## Run & Deployment
- **add environment varialble**
- **Install dependencies** ``npm install``
- **Run the Project locally** ``npm run dev``
- **build** ``npm run build``
- **start** ``npm start``
