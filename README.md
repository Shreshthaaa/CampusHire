# CampusHire - Campus Placement Management App

A full-stack mobile application built with React Native and Node.js that streamlines the college placement process by centralizing opportunity management, student applications, and admin analytics.

## Problem Statement

In many colleges, placement-related communication is handled via WhatsApp groups or emails, leading to:
- Missed opportunities due to message overload
- No centralized tracking of applications
- Manual record-keeping
- Lack of visibility for placement committees on student participation

**CampusHire** solves these problems by providing a centralized platform where:
- Admins can post and manage placement opportunities
- Students can view, apply, and track their applications
- Analytics provide insights into student engagement and application trends

## Tech Stack

### Frontend (Mobile App)
- **React Native** with **Expo**
- **React Navigation** (Stack & Bottom Tabs)
- **Axios** for API calls
- **Email/Password Authentication**
- **AsyncStorage** for local data persistence

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Authentication
- **Email/Password** authentication
- JWT-based session management
- Secure password hashing with bcryptjs

## Features Implemented

### Student Features
- Email/Password registration and login
- View all active placement opportunities
- View detailed opportunity information
- Apply to opportunities with eligibility checking
- Track application status (Applied/Shortlisted/Rejected)
- Edit profile (branch, batch, CGR, resume link)
- Pull-to-refresh on all lists

### Admin Features
- Secure admin access (promoted via backend script)
- Dashboard with statistics and analytics
- Create new placement opportunities
- Manage opportunities (view, delete)
- View applicants for each opportunity
- Update application statuses
- Analytics: participation rate, most applied companies

### Technical Features
- Role-based access control (student/admin)
- Eligibility criteria enforcement (CGR, branch, batch)
- Duplicate application prevention
- Deadline tracking
- Error handling and loading states

## Project Structure

```
CampusHire/
├── backend/                    # Node.js/Express backend
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Opportunity.js
│   │   └── Application.js
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── opportunityController.js
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/             # Auth & validation
│   │   └── auth.js
│   ├── config/                 # Configuration
│   │   └── db.js
│   ├── scripts/                # Utility scripts
│   │   └── makeAdmin.js
│   ├── .env                    # Environment variables
│   ├── server.js               # Entry point
│   └── package.json
│
├── mobile-app/                 # React Native frontend
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   └── LoginScreen.js
│   │   │   ├── student/
│   │   │   │   ├── HomeScreen.js
│   │   │   │   ├── OpportunityDetailScreen.js
│   │   │   │   ├── MyApplicationsScreen.js
│   │   │   │   └── ProfileScreen.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboardScreen.js
│   │   │       ├── CreateOpportunityScreen.js
│   │   │       ├── ManageOpportunitiesScreen.js
│   │   │       └── ApplicantsScreen.js
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── config.js
│   ├── App.js
│   └── package.json
│
└── README.md
```

## How to Run the Project Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g expo-cli`)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shreshthaaa/CampusHire
cd CampusHire
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/campushire
JWT_SECRET=your_jwt_secret_key_change_this
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:5001`

### Step 3: Mobile App Setup

1. Navigate to mobile-app directory:
```bash
cd ../mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Update `src/config.js` with your configuration:
```javascript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5001/api';
export const APP_NAME = 'CampusHire';
```

**Important:** Replace `YOUR_IP_ADDRESS` with your computer's local IP address (not `localhost`). You can find it using:
- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

4. Start the Expo development server:
```bash
npm start
```

5. Run on your device:
- Install **Expo Go** app on your phone
- Scan the QR code from the terminal
- Or press `a` for Android emulator, `i` for iOS simulator

### Step 4: Create an Admin User

1. In the backend directory, run:
```bash
node scripts/makeAdmin.js <your-email> "<your-name>" "<your-password>"
```

2. Login to see admin features

## API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register new user
- **Body:** `{ name: string, email: string, password: string }`
- **Response:** `{ token: string, user: object }`

#### POST `/auth/login`
Login with email and password
- **Body:** `{ email: string, password: string }`
- **Response:** `{ token: string, user: object }`

#### GET `/auth/profile`
Get current user profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ user object }`

#### PUT `/auth/profile`
Update user profile
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ branch, batch, cgr, resumeLink }`
- **Response:** `{ message, user }`

### Opportunity Endpoints

#### GET `/opportunities`
Get all active opportunities
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ opportunity objects ]`

#### GET `/opportunities/:id`
Get opportunity by ID
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ opportunity object }`

#### POST `/opportunities` (Admin only)
Create new opportunity
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ companyName, role, description, eligibility, deadline }`
- **Response:** `{ message, opportunity }`

#### PUT `/opportunities/:id` (Admin only)
Update opportunity
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ companyName, role, description, eligibility, deadline, isActive }`
- **Response:** `{ message, opportunity }`

#### DELETE `/opportunities/:id` (Admin only)
Delete opportunity
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ message }`

#### GET `/opportunities/:id/applicants` (Admin only)
Get applicants for an opportunity
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ application objects with user details ]`

### Application Endpoints

#### POST `/applications`
Apply to an opportunity
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ opportunityId }`
- **Response:** `{ message, application }`

#### GET `/applications/my-applications`
Get user's applications
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ application objects ]`

#### PUT `/applications/:id/status` (Admin only)
Update application status
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ status: "Applied" | "Shortlisted" | "Rejected" }`
- **Response:** `{ message, application }`

### Admin Endpoints

#### GET `/admin/stats` (Admin only)
Get dashboard statistics
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ totalStudents, totalOpportunities, activeOpportunities, totalApplications, applicationsByStatus }`

#### GET `/admin/analytics` (Admin only)
Get detailed analytics
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ mostAppliedCompanies, applicationsPerOpportunity, participationRate, activeStudents, totalStudents }`

## Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Sign in with email and password
- [ ] View opportunities list
- [ ] View opportunity details
- [ ] Apply to opportunity
- [ ] Check application status in "My Applications"
- [ ] Edit profile (branch, batch, CGR, resume)
- [ ] Verify eligibility checking
- [ ] Verify duplicate application prevention

**Admin Flow:**
- [ ] Promote user to admin via script
- [ ] Sign in as admin
- [ ] View dashboard statistics
- [ ] Create new opportunity
- [ ] View applicants for opportunity
- [ ] Update application status
- [ ] Delete opportunity

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  branch: String,
  batch: String,
  cgr: Number (0-10),
  resumeLink: String,
  profilePicture: String,
  timestamps: true
}
```

### Opportunity
```javascript
{
  companyName: String,
  role: String,
  description: String,
  eligibility: {
    minCGR: Number,
    branches: [String],
    batches: [String]
  },
  deadline: Date,
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  timestamps: true
}
```

### Application
```javascript
{
  userId: ObjectId (ref: User),
  opportunityId: ObjectId (ref: Opportunity),
  status: String (enum: ['Applied', 'Shortlisted', 'Rejected']),
  appliedAt: Date,
  timestamps: true
}
```

## Key Features Highlights

1. **Email/Password Authentication**: Secure authentication
2. **Role-Based Access**: Automatic routing based on user role (student/admin)
3. **Eligibility Enforcement**: Automatic checking of CGR, branch, and batch requirements
4. **Real-time Analytics**: Dashboard with participation rates and application trends
5. **Clean UI/UX**: Intuitive design with loading states and error handling
6. **Pull-to-Refresh**: Easy data refresh on all list screens
7. **Status Management**: Admins can update application statuses with one tap

## Contributors

- Shreshtha Sharma - Full Stack Development

## License

This project is created for educational purposes as part of the Mobile Development coursework.

---

**Note:** Make sure to replace placeholder values in configuration files with actual credentials before running the application.
