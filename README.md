# 🎓 CourseFinder Pro - Production Ready Platform

**The Complete B2B Study Abroad Recruitment SaaS Platform**

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-3.0-blue)

## Overview

CourseFinder Pro is a modern, AI-powered SaaS platform for education agents and consultants to manage study abroad recruitment. It combines real-time database, AI-powered tools, and professional analytics into a single, easy-to-use dashboard.

**Perfect for:**
- Education agents and consultancies
- University partnerships
- Student counseling centers
- Education recruitment agencies

## ⭐ Key Features

### Core Functionality
- ✅ **Student CRM** - Manage student profiles, track applications
- ✅ **Course Database** - 100K+ global courses with advanced filtering
- ✅ **Application Pipeline** - 6-stage Kanban board for workflow management
- ✅ **Analytics Dashboard** - Real-time KPIs, charts, insights
- ✅ **Commission Tracking** - Auto-calculated commissions, ledger, payouts

### AI-Powered Tools (Google Gemini)
- ✅ **AI Chat Advisor** - Real-time study abroad counseling
- ✅ **SOP Generator** - Auto-generate statements of purpose
- ✅ **Eligibility Checker** - Analyze student-course fit
- ✅ **Visa Guidance** - Country-specific visa information

### Advanced Features
- ✅ **Email Notifications** - Automated alerts and updates
- ✅ **White-Label Branding** - Customize with your agency colors/logo
- ✅ **Admin Panel** - System management and oversight
- ✅ **Security Rules** - Firestore rules for data isolation
- ✅ **Mobile Responsive** - Works on all devices

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Download & Setup

```bash
# Clone or extract the project
git clone <your-repo-url>
cd coursefinder-pro

# Install dependencies
npm install
```

### 2. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Create **Firestore Database** (Production mode, region: asia-south1)
5. Copy your Firebase config credentials

### 3. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create API key (FREE tier)
3. Copy the key

### 4. Configure Environment

Create `.env.local` file in project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CourseFinder Pro
```

### 5. Deploy Firestore Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### 6. Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 7. Create Test Account

1. Click "Create account"
2. Fill in test data
3. Complete registration
4. Dashboard loads!

## 📱 Pages Overview

| Page | Features | Route |
|------|----------|-------|
| **Dashboard** | KPIs, charts, insights, alerts | `/dashboard` |
| **Students** | CRUD, real-time sync, search | `/dashboard/students` |
| **Courses** | 100K+ courses, filters, details | `/dashboard/courses` |
| **Applications** | Pipeline tracking, status updates | `/dashboard/applications` |
| **AI Tools** | Chat, SOP, Eligibility, Visa | `/dashboard/ai-tools` |
| **Pipeline** | Kanban board, drag-drop | `/dashboard/pipeline` |
| **Commissions** | Ledger, payouts, trends | `/dashboard/commissions` |
| **Analytics** | Advanced charts, reports | `/dashboard/analytics` |
| **Settings** | Profile, branding, notifications | `/dashboard/settings` |
| **Admin** | System management | `/dashboard/admin` |

## 🏗️ Architecture

### Tech Stack

```
Frontend:     Next.js 16 + React 19 + Tailwind CSS
Backend:      Node.js (API routes)
Database:     Firebase Firestore (Real-time)
Auth:         Firebase Authentication
AI:           Google Gemini 2.5 Flash
Email:        Nodemailer
Charts:       Recharts
Hosting:      Vercel (recommended)
```

### Project Structure

```
src/
├── app/                 # Next.js 16 App Router
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main application pages
│   ├── api/            # API routes
│   └── layout.jsx      # Root layout
├── lib/
│   ├── firebase/       # Firebase config & services
│   ├── ai/             # Gemini AI integration
│   ├── email/          # Email service
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utilities
│   └── error-handler.js # Error handling
├── components/         # Reusable UI components
├── contexts/           # React contexts
└── styles/             # Global styles
```

## 🔐 Security

### Firestore Rules
- Default deny (all requests denied unless explicitly allowed)
- User isolation (users see only their data)
- Agency isolation (agents see only their agency's data)
- Read-only courses (for data integrity)

### Authentication
- Firebase Auth (email/password)
- Password validation (min 6 characters)
- Auth guards on all routes
- Secure token management

### API Security
- Input validation (Zod schemas)
- Error handling (no sensitive data exposed)
- Rate limiting ready
- CORS configured

## 📊 Database Schema

### Collections

**users/**
```javascript
{
  uid: "string",
  email: "string",
  firstName: "string",
  lastName: "string",
  role: "agent|admin", // default: agent
  agencyId: "string",
  profile: {
    avatar: "string",
    phone: "string",
    country: "string"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**agencies/**
```javascript
{
  id: "string",
  name: "string",
  owner: "string (uid)",
  members: ["string (uid)"],
  settings: {
    brandColor: "string",
    logo: "string",
    description: "string"
  },
  createdAt: timestamp
}
```

**students/**
```javascript
{
  id: "string",
  agencyId: "string",
  name: "string",
  email: "string",
  phone: "string",
  cgpa: "number",
  englishScore: { ielts: "number", toefl: "number" },
  country: "string",
  field: "string",
  budget: "number",
  createdAt: timestamp
}
```

**applications/**
```javascript
{
  id: "string",
  agencyId: "string",
  studentId: "string",
  courseId: "string",
  status: "profiling|shortlisting|applied|offer|enrolled|visa",
  commission: "number",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🤖 AI Features

### Course Matching
- Analyzes student profile
- Recommends top courses
- Shows admission probability

### SOP Generator
- Auto-writes statements of purpose
- 300-350 words
- Customizable per student

### Eligibility Checker
- Analyzes requirements
- Shows gaps
- Suggests improvements

### Visa Guidance
- Country-specific information
- Document requirements
- Interview tips

## 📧 Email Notifications

Automated emails for:
- Student added
- Application created
- Status updated
- Commission earned
- Weekly reports

**Setup:** Add SMTP credentials to `.env.local`

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. On Vercel.com
# - Import GitHub repo
# - Add environment variables
# - Deploy (1-click)

# Result: https://yourname.vercel.app
```

### Firebase Hosting

```bash
firebase deploy
```

### Self-Hosted

```bash
npm run build
npm run start
```

## 🔧 Development

### Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

### Adding New Pages

1. Create folder in `src/app/dashboard/`
2. Add `page.jsx`
3. Page auto-routes based on folder structure

Example:
```
src/app/dashboard/my-feature/page.jsx
→ Routes to /dashboard/my-feature
```

### Adding API Routes

1. Create file in `src/app/api/`
2. Use `route.js` filename
3. Export `GET`, `POST`, etc.

Example:
```javascript
// src/app/api/hello/route.js
export async function GET(request) {
  return Response.json({ message: 'Hello' });
}

// Access at: /api/hello
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login/Register
- [ ] Add student → appears instantly
- [ ] Create application → status updates work
- [ ] AI Chat responds (needs Gemini API)
- [ ] SOP Generator creates text
- [ ] Dashboard charts load
- [ ] Mobile layout responsive
- [ ] No console errors (F12)

## 🐛 Troubleshooting

### "Firebase config invalid"
```
✓ Check all env vars in .env.local
✓ Verify values match Firebase Console
✓ Restart dev server: Ctrl+C, then npm run dev
```

### "Gemini API not responding"
```
✓ Verify NEXT_PUBLIC_GEMINI_API_KEY is set
✓ Check API key is valid
✓ Check rate limits (15 req/min free tier)
✓ Try again after 1 minute
```

### "Firestore permission denied"
```
✓ Check firestore.rules was deployed
✓ Verify user is authenticated
✓ Check security rules allow the operation
✓ Run: firebase deploy --only firestore:rules
```

### "Port 3000 already in use"
```
✓ Kill process: lsof -ti:3000 | xargs kill -9
✓ Or use different port: PORT=3001 npm run dev
```

## 📚 API Documentation

### AI Endpoints

**Chat API**
```
POST /api/ai/chat
Body: { messages: Array, context: string }
Response: { response: string }
```

**SOP Generator**
```
POST /api/ai/generate-sop
Body: { name, targetProgram, careerGoal, ... }
Response: { sop: string }
```

**Eligibility Check**
```
POST /api/ai/eligibility
Body: { studentProfile, courseDetails }
Response: { analysis: string }
```

**Visa Guidance**
```
POST /api/ai/visa-guidance
Body: { country: string }
Response: { guidance: string }
```

## 💡 Tips & Best Practices

### Performance
- Use React.memo for expensive components
- Implement pagination for large lists
- Cache API responses when possible
- Use lazy loading for images

### Security
- Never commit .env.local
- Rotate API keys regularly
- Use HTTPS in production
- Implement rate limiting

### User Experience
- Show loading states
- Provide error feedback
- Confirm destructive actions
- Use optimistic updates

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - feel free to use commercially

## 🆘 Support

Need help?

1. **Check README** - Solutions for common issues
2. **Review code comments** - Most code is well-documented
3. **Check Firebase docs** - https://firebase.google.com/docs
4. **Check Gemini docs** - https://ai.google.dev/docs

## 🎯 Roadmap

### v3.1 (Next)
- [ ] Payment processing (Stripe)
- [ ] File upload (document storage)
- [ ] Mobile app (React Native)

### v3.2
- [ ] Machine learning (predictive analytics)
- [ ] Video consultations
- [ ] Multi-language support

### v4.0
- [ ] Marketplace
- [ ] Blockchain credentials
- [ ] Employer connections

## 📞 Contact & Feedback

- **Email:** support@coursefinder.pro
- **Website:** www.coursefinder.pro
- **Issues:** GitHub Issues

---

**Built with ❤️ for education agents worldwide**

**Latest Update:** June 26, 2024 | v3.0
