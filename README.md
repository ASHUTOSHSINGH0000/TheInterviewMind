# 🎯 TheInterviewMind

### AI-Powered Interview Preparation Platform

TheInterviewMind is a full-stack web application designed to help candidates prepare for interviews using AI-powered assistance, user authentication, database integration, and payment functionality.

🌐 **Live Website:** [ashutosh-theinterviewmind.vercel.app](https://ashutosh-theinterviewmind.vercel.app/)

📂 **GitHub Repository:** [TheInterviewMind](https://github.com/ASHUTOSHSINGH0000/TheInterviewMind)

---

## ✨ Features

- 🤖 **AI Integration** — AI-powered assistance using the OpenRouter API.
- 🔐 **User Authentication** — Firebase Authentication.
- 🗄️ **Database Management** — MongoDB Atlas integration.
- 💳 **Payment Integration** — Razorpay payment workflow, currently configured for testing.
- ⚛️ **Modern Frontend** — React and Vite.
- 🚀 **REST API Backend** — Node.js and Express.js.
- ☁️ **Cloud Deployment** — Frontend hosted on Vercel and backend hosted on Render.

## 🛠️ Tech Stack

| Technology              | Purpose                                 |
| ----------------------- | --------------------------------------- |
| React                   | Frontend user interface                 |
| Vite                    | Frontend development and build tooling  |
| JavaScript              | Application development                 |
| Node.js                 | Backend runtime                         |
| Express.js              | Backend API                             |
| MongoDB Atlas           | Cloud database                          |
| Firebase Authentication | User authentication                     |
| OpenRouter API          | AI integration                          |
| Razorpay                | Payment integration                     |
| Vercel                  | Frontend hosting                        |
| Render                  | Backend hosting                         |
| Git & GitHub            | Version control and source code hosting |

## 📁 Project Structure

```text
TheInterviewMind/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env                # Local environment variables
├── server/                 # Node.js and Express backend
│   ├── controllers/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```

*Note: The `.env` files are for local configuration and should not be committed to GitHub.*

## 🚀 Getting Started

Follow these steps to run TheInterviewMind locally.

### Prerequisites

Install or configure the following:

- [Node.js](https://nodejs.org/)
- npm
- A MongoDB Atlas database
- A Firebase project
- An OpenRouter API key
- Razorpay test credentials

### 1. Clone the Repository

```bash
git clone https://github.com/ASHUTOSHSINGH0000/TheInterviewMind.git
cd TheInterviewMind
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5001
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Replace each placeholder with your own credentials. Never publish actual secrets.

Start the backend:

```bash
npm run dev
```

The backend should run at `http://localhost:5001`.

### 3. Configure the Frontend

Open a second terminal window. From the project root, run:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Use the exact variable names expected by your application and supply your own Firebase configuration.

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## 🌍 Live Deployment

The application uses the following services:

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Authentication:** [Firebase](https://firebase.google.com/)

### Live Demo

👉 [Visit TheInterviewMind](https://ashutosh-theinterviewmind.vercel.app/)

## 🔒 Security

- Store credentials in environment variables.
- Never commit `.env` files, database passwords, or private API keys.
- Restrict database network access and use appropriate database permissions.
- Keep payment functionality in test mode until production payment credentials and security checks are complete.
- Validate and verify payment transactions on the backend.

## 🚧 Future Enhancements

- Expand AI-powered mock interview functionality.
- Introduce personalized interview preparation plans.
- Add interview progress tracking and performance analytics.
- Support additional technical and non-technical interview categories.
- Improve automated testing, accessibility, and monitoring.

## 👨‍💻 Author

**Ashutosh Kumar Singh**

GitHub: [@ASHUTOSHSINGH0000](https://github.com/ASHUTOSHSINGH0000)

---

⭐ If you find this project interesting, consider starring the repository!

