📘 CareerXplore - Technical Documentation (Updated)
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
State Management	React Context API
File System	Expo FileSystem
PDF Viewing	React Native WebView

🎨 Design System
Color Palette
{
  primary: "#3B444B",
  accent: "#C8A951",
  accentGlow: "rgba(200,169,81,0.35)",
  background: "#F4F6F8",
  card: "#FFFFFF",
  white: "#FFFFFF",
  textDark: "#1C1D1F",
  textLight: "#8E9092",
  grayLight: "#F3F4F6",
  grayBorder: "#D1D5D8",
  success: "#4CAF50",
  danger: "#E15B64"
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
Internship Browsing & Comparison
Application Tracking
Gamification (XP, Badges)
Smart Suggestions
Resume Upload & Viewing

Screen Structure
App
├── Authentication (Login/Signup)
├── Dashboard Shell (Sidebar Navigation)
│   ├── Home Screen
│   ├── Career Recommendations
│   ├── Internships (with Comparison)
│   ├── Application Tracker
│   ├── Analytics
│   └── Profile
└── Detail Screens
    ├── Career Details
    ├── Internship Details (with Smart Suggestions)
    ├── Career Roadmap
    └── Comparison Screen

Key Components
Component	Purpose	Location
Button.js	Reusable button with hover effects	src/components/
InputField.js	Form input	src/components/
SkillSelector.js	Multi-select skills	src/components/
ResumeUploader.js	Resume upload with file handling	src/components/
XPProgressBar.js	Gamification progress	src/components/
InteractiveWrapper.js	Unified hover/press feedback	src/components/
HeaderBanner.js	Full-width banner with overlaid text	src/components/
FilterModal.js	Internship filtering bottom sheet	src/components/
CompareToggle.js	Compare toggle for internships	src/components/
CompareBar.js	Sticky comparison bar	src/components/
SmartSuggestions.js	AI-powered internship suggestions	src/components/
ScreenHeader.js	Consistent screen headers	src/components/

🆕 New Features (Latest Updates)

1. Interactive UI Components

InteractiveWrapper
- Unified hover/press feedback across web and mobile
- Web: Scale transform (1.02x) + shadow on hover
- Mobile: Android ripple effect + opacity feedback
- Smooth 150ms transitions
- Used across all clickable elements (buttons, cards, icons)

HeaderBanner
- Full-width background image banners
- Text overlaid on images (not side-by-side)
- Configurable dark overlay for readability
- Responsive heights (180-260px)
- Used on: Home, Career Recommendations, Internships screens

FilterModal
- Bottom sheet modal for internship filtering
- Filters by: Location, Stipend Range, Type, Duration
- Reusable component with clean UI
- Integrated with internship search

2. Resume Viewer Fixes

ResumeUploader & ProfileScreen
- Fixed mobile PDF viewing issues
- Uses Expo FileSystem for reliable file handling
- Copies files to documentDirectory for consistent access
- Handles remote URLs, content URIs, and local files
- WebView integration for mobile PDF rendering
- Proper MIME type handling

3. Internship Comparison System

ComparisonContext (src/context/ComparisonContext.js)
- Global state management for comparison list
- Maximum 4 internships can be compared
- Methods: addToCompare, removeFromCompare, clearCompare, isInComparison
- Integrated via ComparisonProvider in App.js

CompareToggle Component
- Small, unobtrusive toggle button on each internship card
- Visual feedback: check-circle when selected
- Prevents selection beyond 4 items (shows Alert)
- Positioned in card header

CompareBar Component
- Sticky bottom bar (appears when 2+ internships selected)
- Shows dynamic count: "Compare X internships"
- "Clear" and "Compare →" action buttons
- Navigates to Comparison Screen

ComparisonScreen
- Side-by-side comparison table layout
- Horizontal scroll for multiple internships (2-4)
- Displays: Title, Company, Location, Stipend, Duration, Type, Skills, Match Score
- Highlights best values (e.g., highest stipend with star icon)
- Apply buttons for each internship
- Clean, minimal design with proper spacing

SmartSuggestions Component
- Appears on Internship Details page
- Shows 3-5 similar/better internship recommendations
- Scoring algorithm based on:
  - Same role/category (+20 points)
  - Higher stipend (+30 points)
  - Better skill match (+25 points)
  - Same type (+10 points)
  - Closer location (+15 points)
- Each suggestion includes compare toggle
- Shows reason tags: "Higher stipend", "More skill match", "Closer location"
- Clicking suggestion navigates to its detail page

4. UI/UX Improvements

Career Card Alignment
- Fixed match badge positioning (top-right)
- Fixed favorite icon positioning (bottom-right)
- Proper spacing between elements (12-16px)
- Consistent padding and card heights
- Improved hover effects

Screen Layouts
- SafeAreaView integration across all screens
- Proper ScrollView padding for CompareBar
- Responsive breakpoints (mobile/tablet/desktop)
- Consistent spacing and margins

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
  "users": { 
    "{uid}": { 
      "fullName": "",
      "education": "",
      "skills": [],
      "interests": [],
      "resume": {},
      "profileImage": "",
      "xp": 0,
      "badges": [],
      "profileComplete": false,
      "lastUpdated": "",
      "profileUpdatedAt": ""
    } 
  },
  "admins": { "{uid}": { "role": "admin" } },
  "careers": { "{careerId}": { ... } },
  "internships": { "pending": {}, "approved": {} },
  "notifications": { "{id}": { ... } },
  "favorites": {
    "{uid}": {
      "careers": {},
      "internships": {}
    }
  },
  "applications": {
    "{uid}": {
      "{appId}": {
        "internshipId": "",
        "title": "",
        "company": "",
        "status": "",
        "appliedDate": ""
      }
    }
  }
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

Resume File Handling
- Upload via expo-document-picker
- Store in Firebase with metadata
- Copy to FileSystem.documentDirectory for mobile access
- View via WebView with proper MIME types
- Support for PDF, DOC, DOCX formats

🔒 Firebase Security Rules

Students can only access their own data
Admins can write careers/internships/notifications
Auth required for all reads
Favorites and applications scoped to user

📊 Data Flow
Career Recommendation Flow
User Profile → Fetch Careers → Match & Score → AI Insights → Display

Internship Application Flow
Browse → Filter → Compare (optional) → Apply → Track Status

Comparison Flow
Select Internships (2-4) → Compare Bar Appears → Click Compare → View Side-by-Side → Apply

Smart Suggestions Flow
View Internship Details → Load All Internships → Score & Rank → Display Top 5 → Navigate or Compare

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

📦 Dependencies (Updated)
Core
- expo: ~51.0.0
- react: 18.2.0
- react-native: 0.74.5
- react-native-web: ~0.19.10

Navigation
- @react-navigation/native: ^6.1.18
- @react-navigation/native-stack: ^6.9.28

Firebase
- firebase: ^10.12.0

AI
- @google/generative-ai: ^0.24.1

File Handling
- expo-document-picker: ~12.0.2
- expo-file-system: (added for resume viewing)
- react-native-webview: ^13.16.0

UI Components
- @expo/vector-icons
- react-native-safe-area-context: 4.10.5
- react-native-gesture-handler: ~2.16.1

🧪 Testing (Updated)
Authentication

Signup, login, logout working

Profile

Skills, resume, picture upload
Resume viewing on mobile (fixed)

AI

Career recommendations
Skill-gap analysis

Internships

List, details, apply, favorites
Filtering by location, stipend, type, duration
Comparison (2-4 internships)
Smart suggestions

Web

Hover effects (InteractiveWrapper)
Responsive layout
Full-width banners

Mobile

Touch feedback (ripple effects)
PDF viewing
File system integration

🐛 Troubleshooting
Issue	Fix
AI not generating	Check API key & quota
Firebase denied	Check auth & security rules
Web hover not working	Ensure Platform.OS === "web" in InteractiveWrapper
Resume not displaying on mobile	Check FileSystem.documentDirectory path and WebView MIME type
Comparison limit exceeded	Alert shown, max 4 internships
Compare bar not appearing	Ensure 2+ internships selected in ComparisonContext

📈 Performance Optimization

Lazy loading screens
Memoized computations (useMemo for suggestions)
Reduced bundle size
Cached images
Optimized Firebase queries
Context API for state management (lightweight)

🎮 Gamification System
XP & Badges

XP awarded instantly via Firebase increment()
Badges auto-assigned based on XP, skills, views, applications

Badge Types
- Profile Complete
- Skill Master
- Career Explorer
- Application Starter
- Resume Uploader

📊 Visual Analytics

Includes:

XP progress
Badges
Weekly growth
Career views
Applications data

🆕 Comparison Feature Details

Comparison State Management
- Context-based (ComparisonContext)
- Maximum 4 internships
- Persistent during session
- Cleared on navigation or manual clear

Comparison UI Components
1. CompareToggle: Small icon button on cards
2. CompareBar: Sticky bottom bar (conditional)
3. ComparisonScreen: Full comparison view
4. SmartSuggestions: AI-powered recommendations

Comparison Algorithm
- Side-by-side table layout
- Horizontal scroll for 2-4 items
- Best value highlighting
- Responsive column widths

Smart Suggestions Algorithm
Scoring weights:
- Higher stipend: 30 points
- Better skill match: 25 points
- Same role: 20 points
- Closer location: 15 points
- Same type: 10 points

Top 5 suggestions displayed with reason tags.

🔮 Future Enhancements

Push notifications
Resume builder (AI)
Interview preparation
Skill assessments
Leaderboards
Networking features
Comparison history/saved comparisons
Export comparison as PDF

📞 Support & Maintenance

Firebase monitoring
Expo analytics
Regular updates & patches
File system cleanup for resume storage

📱 Responsive Design

Mobile-first approach
Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Layouts:
- 1 column (mobile)
- 2 columns (tablet)
- 3 columns (desktop)

Touch targets: Minimum 44x44px
Safe area handling on iOS

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
File system permissions handled
Comparison data scoped to user session

📝 Version Summary

Version: 2.0.0
Status: Production Ready
Last Updated: 2024

New Features in v2.0.0:
- Interactive UI components (hover effects)
- Full-width banner system
- Internship filtering
- Resume viewer fixes (mobile)
- Internship comparison system (2-4 items)
- Smart suggestions on detail pages
- Improved card layouts and alignment
- Context-based state management

Previous Features:
- AI Careers, Internships, ATS Scoring, Gamification
- Authentication, Profile Management
- Application Tracking, Analytics

Platforms: Android, iOS, Web

📋 Component Reference

New Components Added:
1. InteractiveWrapper (src/components/InteractiveWrapper.js)
   - Unified interaction wrapper for web/mobile
   - Props: style, hoverStyle, pressedStyle, disabled, onPress, androidRippleColor

2. HeaderBanner (src/components/HeaderBanner.js)
   - Full-width banner with background image
   - Props: image, title, subtitle, height, overlayOpacity, textColor

3. FilterModal (src/components/FilterModal.js)
   - Bottom sheet for internship filtering
   - Props: visible, onClose, onApply, initial

4. CompareToggle (src/components/CompareToggle.js)
   - Toggle button for comparison selection
   - Props: internship, size, style

5. CompareBar (src/components/CompareBar.js)
   - Sticky comparison bar
   - Props: onComparePress

6. SmartSuggestions (src/components/SmartSuggestions.js)
   - AI-powered internship recommendations
   - Props: currentInternship, allInternships, userSkills, onSelect

7. ComparisonContext (src/context/ComparisonContext.js)
   - Global state for comparison list
   - Methods: addToCompare, removeFromCompare, clearCompare, isInComparison

📐 Screen Updates

HomeScreen
- Added HeaderBanner with homepage.jpg
- Hero layout with overlaid text

CareerRecommendationScreen
- Added HeaderBanner with careerrecommendation_header.webp
- Fixed card alignment (badge top-right, favorite bottom-right)
- Improved spacing and padding

InternshipScreen
- Added HeaderBanner with internship_header.jpeg
- Added FilterModal integration
- Added CompareToggle to each card
- Added CompareBar at bottom
- Enhanced filtering system

ProfileScreen
- Removed banner (per design decision)
- Fixed resume viewer for mobile
- Improved file handling

InternshipDetailsScreen
- Added SmartSuggestions component
- Fetches all internships for suggestions
- Loads user skills for matching

ComparisonScreen (New)
- Side-by-side comparison table
- Horizontal scroll layout
- Best value highlighting
- Apply buttons

🔧 Technical Improvements

File System Integration
- expo-file-system for reliable file access
- Document directory storage for resumes
- Proper URI handling (content://, file://, http://)

State Management
- React Context API for comparison state
- Lightweight, no external dependencies
- Session-based persistence

Performance
- Memoized suggestion calculations
- Optimized re-renders
- Efficient filtering algorithms

Accessibility
- Proper touch targets (44x44px minimum)
- Screen reader support
- Keyboard navigation (web)
- Safe area handling (iOS)

🎨 Design Patterns

Component Composition
- Reusable InteractiveWrapper
- Consistent HeaderBanner usage
- Modular FilterModal

State Management Pattern
- Context for global comparison state
- Local state for UI interactions
- Firebase for persistent data

Responsive Design Pattern
- useResponsive hook for breakpoints
- Conditional styling based on platform
- Mobile-first approach
