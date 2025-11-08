# QuizMaster - Interactive Quiz Application

QuizMaster is a full-stack web application that allows users to take quizzes, track their progress, and for administrators to create and manage quizzes. Built with modern technologies and a focus on user experience, it features a responsive design and secure authentication.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Shadcn/ui** for beautiful UI components
- **React Router** for client-side routing
- **Zustand** for state management
- **Axios** for API requests
- **React Hook Form** for form handling
- **Zod** for validation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **cors** for cross-origin resource sharing
- **helmet** for security headers
- **morgan** for logging

## ✨ Features

- 🔐 User authentication (login/register)
- 📝 Interactive quiz taking interface
- 📊 Immediate quiz results and scoring
- 👑 Admin dashboard for quiz management
- 📱 Responsive design for all devices
- 🎯 Real-time score tracking
- 🔒 Secure API endpoints
- 🎨 Modern and clean UI

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HeyAman63/quizmaster-roles.git
   cd quiz_App
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Backend (.env in backend folder):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   Frontend (.env in client folder):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

## 🚀 Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The application will open in your browser at http://localhost:5173

## 📝 Project Structure

```
quiz_App/
├── backend/
│   ├── src/
│   │   ├── config/      # Database and other configurations
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   ├── app.js       # Express app setup
│   │   └── server.js    # Server entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   ├── lib/         # Utilities and helpers
    │   ├── services/    # API service layers
    │   ├── store/       # State management
    │   └── main.tsx     # Entry point
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `POST /api/quizzes` - Create new quiz (Admin only)
- `PUT /api/quizzes/:id` - Update quiz (Admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin only)

### Responses
- `POST /api/responses/submit` - Submit quiz answers
- `GET /api/responses/me` - Get user's quiz attempts
- `GET /api/responses` - Get all responses (Admin only)

## 🔐 Authentication and Authorization

- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes on both frontend and backend
- Secure password hashing with bcrypt

## 🎯 Future Improvements

- [ ] Add quiz categories
- [ ] Implement timed quizzes
- [ ] Add social login
- [ ] Support for multimedia questions
- [ ] Quiz sharing functionality
- [ ] Advanced analytics dashboard
- [ ] Performance optimizations
- [ ] Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **Aman Chaurasiya** - [HeyAman63](https://github.com/HeyAman63)