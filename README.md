# Task Manager MERN Application

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring drag-and-drop functionality and authentication.

## Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Drag-and-drop task management
- Responsive design with Tailwind CSS
- Real-time updates
- Due date tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    └── package.json
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose
- Cors

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Hello Pangea DnD (Drag and Drop)

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user

### Tasks
- GET `/api/tasks` - Get all tasks for authenticated user
- POST `/api/tasks` - Create a new task
- PATCH `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.