# LinkedIn Clone - Social Media Platform

A full-stack social media web application inspired by LinkedIn, built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can sign up, log in, create posts, like/comment on posts, and manage their profiles.
## 🚀 Live Demo

- **Frontend**: [https://app-dost-teal.vercel.app](https://app-dost-teal.vercel.app)
- **Backend API**: [https://appdost-production.up.railway.app](https://appdost-production.up.railway.app)

## ✨ Features

### Core Features
- ✅ **User Authentication**: Sign up and login with email/password
- ✅ **Create Posts**: Share text-based posts with the community
- ✅ **View Feed**: Browse all posts from users (latest first)
- ✅ **User Profile**: View and edit your profile information

### Bonus Features Implemented
- ✅ **Like System**: Like/unlike posts with real-time counter
- ✅ **Comment System**: Add comments to posts
- ✅ **Edit Posts**: Edit your own posts
- ✅ **Delete Posts**: Remove your own posts
- ✅ **Profile Management**: Update name and bio
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Real-time Updates**: Dynamic UI updates without page refresh

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI framework
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Modern icon library
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
**Getting MongoDB URI:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and replace `<password>` with your database password
4. Add your IP address to the whitelist


## 📁 Project Structure

```
linkedin-clone/
├── backend/
│   ├── .env                 # Environment variables
│   ├── .gitignore          # Git ignore rules
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md               # This file
```

## 🚢 Deployment

### Backend Deployment (Railway/Render)

**Using Railway:**
1. Sign up at [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)

**Using Vercel:**
1. Sign up at [Verce](https://vercel.com)
2. Create new project from GitHub
3. Add environment variables in Railway dashboard
4. Deploy automatically on push
```
## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:postId/comment/:commentId` - Delete comment

### Users
- `GET /api/users/:id` - Get user profile with posts

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 🎨 UI Features

- Modern, clean LinkedIn-inspired design
- Smooth animations and transitions
- Responsive layout (mobile-first)
- Custom scrollbar styling
- Glass morphism effects
- Loading states and error handling

## 📝 Usage

1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Access your account
3. **Create Post**: Share your thoughts on the feed
4. **Interact**: Like and comment on posts
5. **Edit Profile**: Update your name and bio
6. **Manage Posts**: Edit or delete your own posts
