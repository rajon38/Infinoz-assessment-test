/ README.md template
`# Chatbot Backend API

A secure, production-ready backend system for a chatbot application with user authentication, message handling, and chat history storage.

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **Chat Functionality**: Send messages and receive dummy bot responses
- **Chat History**: Store and retrieve conversation history
- **Security**: Password hashing, JWT authentication, rate limiting
- **Database**: MongoDB with proper schema design
- **Deployment Ready**: Configured for cloud deployment
- **Documentation**: Complete API documentation with examples

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/rajon38/Infinoz-assessment-test.git
   cd Infinoz-assessment-test
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. . **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update the \`.env\` file with your values:
   \`\`\`
    DATABASE_URL="mongodb+srv://rajon38:rajon38@smt.czp1e.mongodb.net/chat-bot?retryWrites=true&w=majority"
    NODE_ENV="development"
    PORT=5005
    BCRYPT_SALT_ROUNDS=12
    JWT_SECRET="YOUR SECRET" 
    EXPIRES_IN="30d"
    REFRESH_TOKEN_SECRET="YOUR SECRET"
    REFRESH_TOKEN_EXPIRES_IN="30d"
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Health Check**
   Visit \`http://localhost:5005`

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://chat-bot-assessment-test.vercel.app/`
- **Postman**: `https://documenter.getpostman.com/view/24585156/2sB3QDvt1c`