📘 CareerXplore - Technical Documentation (Summarized)
🎯 Project Overview

CareerXplore is an AI-powered platform helping students discover careers based on their skills, interests, and education.
The system includes:

Student App (Mobile/Web)

Admin Dashboard (Web)

Powered by Firebase + Gemini AI

🏗️ System Architecture
Platform Components
CareerXplore Platform
├── Student Application (Mobile/Web) - React Native + Expo
└── Admin Dashboard (Web Only) - React + Material UI

Technology Stack
Component	Technology
Student App	React Native + Expo
Admin Dashboard	React + Material UI
Database	Firebase Realtime DB
Authentication	Firebase Auth
AI Engine	Gemini 2.5 Flash
Charts	Recharts
🎨 Design System
Color Palette
{
  primary: "#3B444B",
  accent: "#C8A951",
  background: "#F4F6F8",
  card: "#FFFFFF",
  textDark: "#1C1D1F",
  textLight: "#8E9092"
}

Typography

Headings: bold, primary color

Body: regular, dark gray

Secondary: light gray

📱 Student Application
Features

Authentication

Profile Management

Career Recommendations (AI-Based)

Internship Browsing

Application Tracking

Gamification (XP, Badges)

Screen Structure
App
├── Authentication (Login/Signup)
├── Bottom Tabs (Home, Careers, Internships, Applications, Profile)
└── Detail Screens

Key Components
Component	Purpose
Button.js	Reusable button
InputField.js	Form input
SkillSelector.js	Multi-select skills
ResumeUploader.js	Resume upload
XPProgressBar.js	Gamification progress
🔐 Authentication & Security
Student Authentication
createUserWithEmailAndPassword()
signInWithEmailAndPassword()

Admin Authentication

Email domain check (@careerxplore.com)

Firebase authentication

Role verification in DB

🗄️ Database Schema
{
  "users": { "{uid}": { ... } },
  "admins": { "{uid}": { "role": "admin" } },
  "careers": { "{careerId}": { ... } },
  "internships": { "pending": {}, "approved": {} },
  "notifications": { "{id}": { ... } }
}

🤖 AI Integration
AI Features

Career insights

Skill-gap analysis

Roadmaps

Resume extraction & ATS scoring

JSON-Based Response Format
{
  "whyRecommended": "",
  "skillGaps": [],
  "recommendedCourses": [],
  "futureScope": ""
}

🎯 Compatibility Score Algorithm
score = (matchedSkills / totalSkills) * 100


Used for sorting and ranking career recommendations.

📄 Resume Analysis Pipeline
1. Extract → 2. Score → 3. Recommend

Extract

AI reads resume & returns JSON.

Score

AI generates ATS score + missing skills.

Recommend

AI highlights improvements & strengths.

🔒 Firebase Security Rules

Students can only access their own data

Admins can write careers/internships/notifications

Auth required for all reads

📊 Data Flow
Career Recommendation Flow
User Profile → Fetch Careers → Match & Score → AI Insights → Display

Internship Application Flow
Browse → Apply → Track Status

🚀 Deployment
Student App
expo build:web
eas build -p android
eas build -p ios

Hosting
firebase deploy --only hosting:app

Environment Variables
GEMINI_API_KEY
FIREBASE_API_KEY

📦 Dependencies (Summary)

Expo

React Native

Firebase

Recharts

@google/generative-ai

🧪 Testing (Summary)
Authentication

Signup, login, logout working

Profile

Skills, resume, picture upload

AI

Career recommendations

Skill-gap analysis

Internships

List, details, apply, favorites

Web

Hover effects

Responsive layout

🐛 Troubleshooting
Issue	Fix
AI not generating	Check API key & quota
Firebase denied	Check auth & security rules
Web hover not working	Ensure Platform.OS === "web"
📈 Performance Optimization

Lazy loading screens

Memoized computations

Reduced bundle size

Cached images

Optimized Firebase queries

🎮 Gamification System
XP & Badges

XP awarded instantly via Firebase increment()

Badges auto-assigned based on XP, skills, views, applications

📊 Visual Analytics

Includes:

XP progress

Badges

Weekly growth

Career views

Applications data

🔮 Future Enhancements

Push notifications

Resume builder (AI)

Interview preparation

Skill assessments

Leaderboards

Networking features

📞 Support & Maintenance

Firebase monitoring

Expo analytics

Regular updates & patches

📱 Responsive Design

Mobile-first

1/2/3 column layouts based on breakpoints

Tablet & desktop optimized

🌐 Deployment & Compatibility

Android, iOS, Web supported

All major browsers supported

Expo EAS for builds

Netlify / Vercel / Firebase for web hosting

🔒 Security Checklist

API keys secured

Role-based access control

Input validation

HTTPS enforced

Firebase rules strict

📝 Version Summary

Version: 1.1.0
Status: Production Ready
Features: AI Careers, Internships, ATS Scoring, Gamification
Platforms: Android, iOS, Web