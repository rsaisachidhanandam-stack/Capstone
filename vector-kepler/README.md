# 📝 Blogify API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Live Demo:** [https://blogify-api-v1.onrender.com](https://blogify-api-v1.onrender.com)

> A robust, professional-grade RESTful API for a modern blogging platform, featuring full authentication, post management, secure payments, and cloud media handling.

---

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based user registration and login with encrypted passwords.
- **📰 Content Management**: Full CRUD operations for blog posts with cursor-based pagination.
- **🖼️ Media Handling**: Seamless image uploads integrated with Cloudinary for optimized storage.
- **💳 Payment Integration**: Secure payment processing and intent creation using Stripe API.
- **📦 Order System**: Comprehensive order management and tracking.
- **☁️ Cloud Infrastructure**: Hosted on MongoDB Atlas for maximum reliability and scalability.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Server-side runtime environment |
| **Express.js** | Web application framework for Node.js |
| **MongoDB** | NoSQL database for flexible data storage |
| **Mongoose** | Elegant MongoDB object modeling for Node.js |
| **JWT** | Secure JSON Web Token authentication |
| **Cloudinary** | Cloud-based image and video management |
| **Stripe** | Online payment processing platform |
| **bcryptjs** | Secure password hashing and encryption |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Cloudinary](https://cloudinary.com/) API credentials
- [Stripe](https://stripe.com/) API keys

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rsaisachidhanandam-stack/vector-kepler.git
   cd vector-kepler
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory (refer to the [Environment Variables](#environment-variables) section below).

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & get token | No |

### 📝 Posts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Get all posts (with pagination) | No |
| `GET` | `/api/posts/:id` | Get details of a single post | No |
| `POST` | `/api/posts` | Create a new blog post | **Yes** |
| `PUT` | `/api/posts/:id` | Update an existing post | **Yes** |
| `DELETE` | `/api/posts/:id` | Remove a blog post | **Yes** |

### 📁 Media & Payments
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload image to Cloudinary | **Yes** |
| `POST` | `/api/payments/create-intent` | Create Stripe payment intent | **Yes** |
| `POST` | `/api/payments/confirm` | Confirm payment status | **Yes** |

### 📦 Orders
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create a new order | **Yes** |
| `GET` | `/api/orders/my-orders` | Get current user's orders | **Yes** |
| `GET` | `/api/orders/:id` | Get specific order details | **Yes** |

---

## 📁 Project Structure

```text
backend/
├── controllers/    # Request handlers
├── middleware/     # Custom auth & error middleware
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
├── uploads/        # Local temporary file storage
├── server.js       # Application entry point
└── .env            # Environment secrets
```

---

## 🎓 What I Learned

Building this API was a significant milestone in my journey as a backend developer. Some key takeaways include:
- **Scalable Architecture**: Designing a clean separation of concerns between models, routes, and controllers to ensure the codebase remains maintainable.
- **Security Best Practices**: Implementing robust authentication patterns using JWT and ensuring sensitive data like passwords are never stored in plain text.
- **Third-Party Integrations**: Successfully orchestrating workflows between Stripe for payments and Cloudinary for media, handling asynchronous responses and error states gracefully.
- **Database Optimization**: Leveraging MongoDB Atlas for cloud hosting and Mongoose for schema validation to ensure data integrity.

---

## 👥 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by [Sai Sachidhanandam](https://github.com/rsaisachidhanandam-stack)**
