# TaskFlow

TaskFlow is a sleek and simple task management web application built with Node.js, MongoDB, and vanilla JavaScript. Users can add, manage, edit, and view tasks in a dashboard or calendar view. It includes user authentication, profile management, customizable themes, and more.

---

## 🚀 Features

- ✅ User registration & login with JWT
- 📅 Calendar view of tasks
- ✏️ Edit/Delete tasks
- 🌓 Theme switching
- 🌍 Timezone & 12/24-hour format preferences
- 🧾 Profile editing with password update
- 🗑️ Delete account functionality

---

## 📦 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Auth**: JWT & bcrypt

---

## 🛠 Installation Guide

### 1. **Clone the repository**
git clone git@github.com:LeoSadoun/Taskflow.git
cd Taskflow

### 2. **Install dependencies**
You’ll need Node.js and MongoDB installed on your machine.
cd backend
npm install

### 3. **Set up environment variables**
Create a .env file inside the backend/ directory:
  MONGO_URI=mongodb://localhost:27017/taskflow
  JWT_SECRET=your_jwt_secret
  EMAIL_USER=your_email@example.com     # (Optional, only for email confirmation)
  EMAIL_PASS=your_email_password_or_app_password
  
⚠️ If you're not using email confirmations, you can ignore the EMAIL_USER and EMAIL_PASS.

### 4. **Make sure Mongodb is running**
sudo service mongod start

### 5. **Start the developement server**
npm run dev

**💻 Frontend Setup**
Make sure you open the index.html file in the root directory using Live Server or a similar tool.
If you're just opening the file manually, make sure the backend is running at http://localhost:5000.

**✅ Accounts & Profiles**
Register a new account via the Login/Register form
Update your name, email, or password via the Profile page
Delete your account from the Settings page

**📆 Task Management**
Add a task with title, description, priority, and optional due date
View and filter tasks by priority, name, and upcoming date
Switch to calendar view to see tasks by day
Mark tasks as done/undone

**🎨 Themes**
Choose between:
  Midnight Aurora
  Frosted Indigo
  Blush Rose

Available in Settings → Theme dropdown.
