# 📘 CareerXplore - Technical Documentation

## 🎯 Project Overview

**CareerXplore** is an AI-powered career recommendation platform that helps students discover suitable career paths based on their skills, interests, and educational background. The system includes a mobile/web application for students and a dedicated web-based admin dashboard for platform management.

---

## 🏗️ System Architecture

### Platform Components

```
CareerXplore Platform
├── Student Application (Mobile/Web)
│   └── React Native + Expo
└── Admin Dashboard (Web Only)
    └── React + Material UI
```

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Student App** | React Native | 0.76.3 |
| **Student Framework** | Expo | ~54.0.0 |
| **Admin Dashboard** | React | 18.2.0 |
| **UI Library (Admin)** | Material UI | 5.15.0 |
| **Backend** | Firebase Realtime Database | 10.12.0 |
| **Authentication** | Firebase Auth | 10.12.0 |
| **AI Engine** | Google Gemini API | 2.5-flash |
| **Navigation** | React Navigation | 6.x |
| **Charts** | Recharts | 2.10.0 |

---

## 🎨 Design System

### Color Palette

```javascript
{
  primary: "#3B444B",        // Arsenic (Dark Gray)
  accent: "#C8A951",         // Sleek Gold
  accentGlow: "rgba(200,169,81,0.35)",
  background: "#F4F6F8",     // Light Gray
  card: "#FFFFFF",           // White
  textDark: "#1C1D1F",
  textLight: "#8E9092",
  grayLight: "#F3F4F6",
  grayBorder: "#D1D5D8",
  danger: "#E15B64"
}
```

### Typography
- **Primary Font**: System Default (San Francisco/Roboto)
- **Headings**: Bold, Arsenic (#3B444B)
- **Body**: Regular, Dark Gray (#1C1D1F)
- **Secondary**: Light Gray (#8E9092)

---

## 📱 Student Application

### Features

1. **Authentication**
   - Email/Password signup and login
   - Profile completion tracking
   - Session management

2. **Profile Management**
   - Skills selection (multi-select)
   - Interests selection
   - Education level
   - Resume upload
   - Profile completion percentage

3. **Career Recommendations**
   - AI-powered career matching
   - Personalized insights using Gemini API
   - Skill gap analysis
   - Course recommendations
   - Future scope predictions

4. **Internship Search**
   - Browse approved internships
   - Filter by location, company
   - Detailed internship information
   - Favorite internships

5. **Application Tracker**
   - Track application status
   - Manage multiple applications
   - Status updates (Applied, Interview, Offer, Rejected)

6. **Gamification System**
   - XP rewards for activities
   - Achievement badges
   - Profile completion progress bar
   - Real-time engagement tracking

### Screen Structure

```
App
├── Authentication
│   ├── LoginScreen
│   └── SignupScreen
├── Main Navigation (Bottom Tabs)
│   ├── HomeScreen
│   ├── CareerRecommendationScreen
│   ├── InternshipScreen
│   ├── ApplicationTrackerScreen
│   └── ProfileScreen
└── Detail Screens
    ├── CareerDetailsScreen
    └── InternshipDetailsScreen
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `Button.js` | Reusable styled button |
| `InputField.js` | Form input with validation |
| `SkillSelector.js` | Multi-select skill picker |
| `InterestSelector.js` | Interest selection UI |
| `ResumeUploader.js` | Document upload handler |
| `TrackerWidget.js` | Application status widget |
| `ProfileNotification.js` | Profile completion alerts |
| `ProgressBar.js` | Visual progress indicator |
| `GamificationCard.js` | XP, badges, and progress display |

---

## 🔐 Authentication & Security

### Student Authentication
```javascript
// Firebase Email/Password Authentication
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// User creation
await createUserWithEmailAndPassword(auth, email, password);

// User login
await signInWithEmailAndPassword(auth, email, password);
```

### Admin Authentication
```javascript
// Domain validation + Role verification
const ADMIN_DOMAIN = '@careerxplore.com';

// Step 1: Email domain check
if (!email.endsWith(ADMIN_DOMAIN)) {
  throw new Error('Access denied');
}

// Step 2: Firebase authentication
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// Step 3: Database role verification
const adminRef = ref(db, `admins/${user.uid}`);
const snapshot = await get(adminRef);
if (snapshot.val().role !== 'admin') {
  throw new Error('Unauthorized');
}
```

---

## 🗄️ Database Schema

### Firebase Realtime Database Structure

```json
{
  "users": {
    "{studentUid}": {
      "email": "student@example.com",
      "name": "John Doe",
      "skills": ["JavaScript", "React", "Python"],
      "interests": ["Web Development", "AI"],
      "education": "Bachelor's in Computer Science",
      "profileCompletion": 85,
      "createdAt": 1234567890,
      "favorites": {
        "careers": ["{careerId1}", "{careerId2}"],
        "internships": ["{internshipId1}"]
      },
      "applications": {
        "{applicationId}": {
          "internshipId": "{internshipId}",
          "status": "Applied",
          "appliedDate": 1234567890
        }
      }
    }
  },
  "admins": {
    "{adminUid}": {
      "role": "admin",
      "email": "admin@careerxplore.com",
      "displayName": "System Admin",
      "createdAt": 1234567890
    }
  },
  "internships": {
    "pending": {
      "{internshipId}": {
        "title": "Software Engineering Intern",
        "company": "Tech Corp",
        "location": "Remote",
        "description": "...",
        "requirements": "...",
        "submittedAt": 1234567890
      }
    },
    "approved": {
      "{internshipId}": {
        "title": "Data Analyst Intern",
        "company": "Data Inc",
        "location": "New York",
        "status": "approved",
        "approvedAt": 1234567890,
        "approvedBy": "{adminUid}"
      }
    }
  },
  "careers": {
    "{careerId}": {
      "title": "Full Stack Developer",
      "description": "Build web applications...",
      "skills": "React, Node.js, MongoDB",
      "salary": "$80k-$120k",
      "growth": "High demand",
      "createdAt": 1234567890
    }
  },
  "notifications": {
    "{notificationId}": {
      "message": "New internships available!",
      "timestamp": 1234567890,
      "type": "broadcast",
      "sentBy": "{adminUid}"
    }
  }
}
```

---

## 🤖 AI Integration

### Gemini API Implementation

```javascript
// AI Service for Career Insights
const API_KEY = process.env.GEMINI_API_KEY;

async function generateCareerInsights(userProfile, career) {
  const prompt = `
    Given this user profile:
    Skills: ${userProfile.skills.join(", ")}
    Interests: ${userProfile.interests.join(", ")}
    Education: ${userProfile.education}
    
    Analyze why "${career.title}" is recommended.
    Provide:
    1. Why this career matches (2-3 sentences)
    2. Skill gaps (3-4 missing skills)
    3. Top 3 recommended courses
    4. Future scope prediction
  `;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  
  return response.json();
}
```

### AI Response Parsing

```javascript
parseInsights(text) {
  const sections = {
    whyRecommended: "",
    skillGaps: [],
    recommendations: [],
    futureScope: ""
  };
  
  // Parse numbered sections from AI response
  const parts = text.split(/\d+\.\s+/);
  sections.whyRecommended = parts[1]?.trim();
  sections.skillGaps = parts[2]?.split(/\n|\*/).filter(s => s.length > 3);
  sections.recommendations = parts[3]?.split(/\n|\*/).filter(s => s.length > 3);
  sections.futureScope = parts[4]?.trim();
  
  return sections;
}
```

---

## 🔒 Firebase Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || auth != null",
        ".write": "$uid === auth.uid"
      }
    },
    "admins": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "internships": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "careers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "notifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

---

## 📊 Data Flow

### Career Recommendation Flow

```
1. Student completes profile
   ↓
2. Profile data stored in Firebase
   ↓
3. Student navigates to Career Recommendations
   ↓
4. System fetches careers from database
   ↓
5. For each career:
   - Match skills with user profile
   - Calculate compatibility score
   ↓
6. User selects a career
   ↓
7. AI generates personalized insights
   - Gemini API call with user profile + career
   - Parse AI response
   ↓
8. Display insights to user
   - Why recommended
   - Skill gaps
   - Course recommendations
   - Future scope
```

### Internship Application Flow

```
1. Student browses approved internships
   ↓
2. Student clicks "Apply"
   ↓
3. Application saved to user's applications
   ↓
4. Status: "Applied"
   ↓
5. Student can update status in Application Tracker
   ↓
6. Status options: Applied → Interview → Offer/Rejected
```

---

## 🚀 Deployment

### Student App Deployment

**Expo Build:**
```bash
# Web build
expo build:web

# Android APK
expo build:android

# iOS build
expo build:ios
```

**Firebase Hosting:**
```bash
firebase deploy --only hosting:app
```

### Environment Variables

```javascript
// app.config.js
export default {
  extra: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  }
};
```

---

## 📦 Dependencies

### Student App (package.json)

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "react": "18.2.0",
    "react-native": "0.76.3",
    "firebase": "^10.12.0",
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@google/generative-ai": "^0.24.1",
    "expo-document-picker": "~14.0.8",
    "expo-image-picker": "~17.0.9",
    "lucide-react-native": "^0.555.0"
  }
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User can sign up with email/password
- [ ] User can log in
- [ ] Session persists on app restart
- [ ] Logout works correctly

**Profile:**
- [ ] Skills can be selected
- [ ] Interests can be selected
- [ ] Profile completion updates
- [ ] Resume can be uploaded

**Career Recommendations:**
- [ ] Careers display correctly
- [ ] AI insights generate successfully
- [ ] Skill gaps show accurately
- [ ] Recommendations are relevant

**Internships:**
- [ ] Approved internships display
- [ ] Internship details load
- [ ] Favorites work correctly

**Application Tracker:**
- [ ] Applications can be added
- [ ] Status can be updated
- [ ] Applications persist

---

## 🐛 Troubleshooting

### Common Issues

**Issue: AI insights not generating**
- Check Gemini API key is set in environment
- Verify API quota not exceeded
- Check network connectivity

**Issue: Firebase permission denied**
- Verify security rules deployed
- Check user is authenticated
- Verify database structure matches rules

**Issue: Profile completion not updating**
- Check all required fields are filled
- Verify calculation logic in `profileUtils.js`

---

## 📈 Performance Optimization

### Best Practices Implemented

1. **Lazy Loading**: Components load on demand
2. **Memoization**: React.memo for expensive components
3. **Image Optimization**: Compressed assets
4. **Database Queries**: Indexed queries for faster reads
5. **Caching**: Firebase persistence enabled

---

## 🎮 Gamification System

### XP Rewards

| Action | XP Earned |
|--------|----------|
| Complete Profile | 100 XP |
| Add Skill | 10 XP |
| Add Interest | 10 XP |
| Upload Resume | 50 XP |
| Apply to Internship | 30 XP |
| View Career Details | 5 XP |

### Achievement Badges

| Badge | Icon | Requirement |
|-------|------|-------------|
| Skill Prodigy | 🎯 | Add 5+ skills |
| Fast Learner | ⚡ | Earn 200+ XP |
| Career Explorer | 🔍 | View 10+ careers |
| Go-Getter | 🚀 | Apply to 5+ internships |

### Database Schema

```json
"users": {
  "{userId}": {
    "xp": 250,
    "badges": ["skill_prodigy", "fast_learner"],
    "careerViews": 12,
    "applications": 3
  }
}
```

---

## 🔮 Future Enhancements

1. **Push Notifications**: Real-time alerts for new internships
2. **Chat Support**: In-app messaging with career counselors
3. **Video Tutorials**: Embedded learning resources
4. **Resume Builder**: AI-powered resume generation
5. **Interview Prep**: Mock interview questions
6. **Skill Assessments**: Automated skill testing
7. **Job Board**: Full-time job listings
8. **Networking**: Connect with alumni and professionals
9. **Leaderboards**: Compete with peers on XP
10. **Daily Challenges**: Bonus XP for completing tasks

---

## 📞 Support & Maintenance

### Monitoring
- Firebase Console for database monitoring
- Expo Analytics for app usage
- Error logging with console.error

### Updates
- Regular dependency updates
- Security patches
- Feature additions based on user feedback

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Platform**: Cross-platform (iOS, Android, Web)  
**License**: Proprietary
