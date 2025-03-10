
## Overview
This project is a submission for the **Round 2: Node SDE Intern Assignment** by The Internet Folks (TIF). It implements a SaaS platform API that allows users to create communities, manage members, and assign roles (`Community Admin` and `Community Member`). The application is built using **Node.js**, **Express**, and **MongoDB** with **Mongoose** as the ORM, adhering to the strict requirements outlined in the assignment.

### Features
- **Authentication**: User signup, sign-in, and self-profile retrieval.
- **Community Management**: Create communities, list all communities, and view owned/joined communities.
- **Member Moderation**: Add/remove members with role-based access control.
- **Role Management**: Create and list roles (strictly `Community Admin` and `Community Member`).

### Tech Stack
- **Language**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **ORM**: Mongoose
- **Libraries**:
  - `@theinternetfolks/snowflake` for unique ID generation
  - `bcryptjs` for password hashing
  - `jsonwebtoken` for authentication
  - `validator` for input validation
  - `cors` for cross-origin requests
  - `dotenv` for environment variables

---

## Project Structure
```
tif-sde-intern/
├── /models/            # Mongoose schema models
│   ├── User.js
│   ├── Role.js
│   ├── Community.js
│   ├── Member.js
├── /routes/            # API route handlers
│   ├── authRoutes.js
│   ├── roleRoutes.js
│   ├── communityRoutes.js
│   ├── memberRoutes.js
├── /middlewares/       # Custom middleware
│   ├── authMiddleware.js
├── server.js           # Entry point of the application
├── package.json        # Project dependencies and scripts
├── .env                # Environment variables (not tracked in git)
├── config.js           # Configuration file
└── README.md           # Project documentation (this file)
```

---

## Prerequisites
- **Node.js**: v14 or higher
- **MongoDB Atlas**: A free cluster for database hosting
- **Postman**: For API testing
- **Git**: For version control

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-github-url>
cd tif-sde-intern
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tif_swe?retryWrites=true&w=majority
JWT_SECRET=<your-jwt-secret>
PORT=5000
```
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials.
- Use a strong `<your-jwt-secret>` (e.g., a random string).

### 4. Run the Application
```bash
npm start
```
- The server will start on `http://localhost:5000` (or the port specified in `.env`).

---

## API Endpoints

### Base URL
- Local: `http://localhost:5000`
- Deployed (optional): `<your-deployment-url>`

### Role Endpoints
| Method | Endpoint            | Payload Example                       | Description                   |
|--------|---------------------|---------------------------------------|-------------------------------|
| POST   | `/v1/role`          | `{"name": "Community Admin"}`         | Create a role                 |
| GET    | `/v1/role`          | None                                  | Get all roles                 |

### Authentication Endpoints
| Method | Endpoint            | Payload Example                       | Description                   |
|--------|---------------------|---------------------------------------|-------------------------------|
| POST   | `/v1/auth/signup`   | `{"name": "John", "email": "john@example.com", "password": "pass123"}` | User signup                   |
| POST   | `/v1/auth/signin`   | `{"email": "john@example.com", "password": "pass123"}` | User sign-in                  |
| GET    | `/v1/auth/me`       | None                                  | Get authenticated user (auth) |

### Community Endpoints
| Method | Endpoint                     | Payload Example                       | Description                   |
|--------|------------------------------|---------------------------------------|-------------------------------|
| POST   | `/v1/community`              | `{"name": "Test", "slug": "test"}`   | Create community (auth)       |
| GET    | `/v1/community`              | None                                  | Get all communities           |
| GET    | `/v1/community/:id/members`  | None                                  | Get community members         |
| GET    | `/v1/community/me/owner`     | None                                  | Get owned communities (auth)  |
| GET    | `/v1/community/me/member`    | None                                  | Get joined communities (auth) |

### Member Endpoints
| Method | Endpoint            | Payload Example                                      | Description                   |
|--------|---------------------|-----------------------------------------------------|-------------------------------|
| POST   | `/v1/member`        | `{"community": "<id>", "user": "<id>", "role": "<id>"}` | Add member (auth, admin only) |
| DELETE | `/v1/member/:id`    | None                                                | Remove member (auth, admin/moderator) |

- **Auth**: Requires `Authorization: Bearer <token>` header for protected routes.
- **IDs**: Use snowflake IDs generated by the application.

---

## Testing with Postman

### 1. Setup Environment
- Create an environment in Postman named `TIF-SDE`.
- Add variables:
  - `base_url`: `http://localhost:5000`
  - `token`: Leave blank (set after sign-in).

### 2. Testing Workflow
1. **Initialize Roles**:
   - `POST http://localhost:5000/v1/role`
     - Body: `{"name": "Community Admin"}`
     - Body: `{"name": "Community Member"}`
   - Save `id` values as `admin_role_id` and `member_role_id`.

2. **Sign Up**:
   - `POST http://localhost:5000/v1/auth/signup`
     - Body: `{"name": "John Doe", "email": "john.doe@example.com", "password": "password123"}`
   - Save `id` as `user_id_1`.

3. **Sign In**:
   - `POST http://localhost:5000/v1/auth/signin`
     - Body: `{"email": "john.doe@example.com", "password": "password123"}`
   - Save `access_token` as `token`.

4. **Create Community**:
   - `POST http://localhost:5000/v1/community`
     - Headers: `Authorization: Bearer {{token}}`
     - Body: `{"name": "Test Community", "slug": "test-community"}`
   - Save `id` as `community_id`.

5. **Add Member**:
   - Sign up a second user and get `user_id_2`.
   - `POST http://localhost:5000/v1/member`
     - Headers: `Authorization: Bearer {{token}}`
     - Body: `{"community": "<community_id>", "user": "<user_id_2>", "role": "<member_role_id>"}`
   - Save `id` as `member_id`.

6. **Test Other Endpoints**:
   - Use the URLs and payloads from the table above, replacing IDs with actual values.

### 3. Verify Responses
- Success: `{"status": true, "content": {"data": ...}}`
- Error: `{"status": false, "error": {"message": ...}}`

---

## Deployment (Optional)
- **Platform**: Heroku, Vercel, or similar.
- Steps:
  1. Push code to a public GitHub repository.
  2. Connect to Heroku, set environment variables in the dashboard.
  3. Deploy and update `base_url` in Postman to the deployed URL.

---


