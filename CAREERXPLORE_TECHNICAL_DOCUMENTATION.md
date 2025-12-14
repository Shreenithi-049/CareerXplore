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

### 5. Performance Improvements (New)
- **Startup Speed**: Implemented `expo-splash-screen` with `expo-asset` to pre-load heavy images, eliminating layout shifts.
- **List Virtualization**: Refactored `InternshipScreen` and `CareerRecommendationScreen` to use `FlatList`.
  - Enables smooth 60fps scrolling for large datasets.
  - Implemented dynamic grid columns (1/2/3) for Career Recommendations.
- **Memoization**: Optimized rendering with `useMemo` and `useCallback`.

### 6. Mobile & Web Robustness
- **Android Resume Security**: Implemented `FileSystem.getContentUriAsync` to safely convert `file://` paths to `content://` URIs, preventing `FileUriExposedException` crashes.
- **Web Compatibility Enhancements**:
  - `ResumeUploader`: Bypasses `expo-file-system` on Web, using Blob URIs instead.
  - `ProfileScreen`: Fallback to `fetch` + `FileReader` for analyzing Web Blobs.
  - **Self-Healing**: Added "Remove Now" recovery option for stale Web Blob URLs.

### 7. Application Tracker Overhaul
- **Isolated Data Source**: Tracker data moved to `users/${uid}/my_tracker_entries` to prevent legacy data conflicts.
- **Sequential Status**: Logic to enforce correct status progression (Saved -> Applied -> Interview...).
- **Funnel Analytics**: refactored `getStatusStats` for accurate funnel visualization.

### 8. Web Application Flow
- **Resume Analysis**: Optimized for Web using base64 checks to avoid re-downloading Blobs.
- **Hover Effects**: Smoother CSS-like transitions using `InteractiveWrapper`.

### 🔒 Security & Data Integrity
- **Tracker Isolation**: `my_tracker_entries` node ensures purely explicit tracking interactions.
- **Android File Sharing**: Strict compliance with Android N+ file sharing policies via Content URIs.

### 🚀 Deployment Readiness (Updated)
- **Web**: Validated `app.config.js` and `package.json`.
- **Mobile**: Configured package names (`com.student.careerportal`) and secure file handling for Android store compliance.

### 🔮 Future Enhancements
- Push notifications
- Resume builder (AI)
- Interview preparation
- Skill assessments
- Leaderboards
- Networking features
- Comparison history/saved comparisons
- Export comparison as PDF

### 📞 Support & Maintenance
- Firebase monitoring
- Expo analytics
- Regular updates & patches
- File system cleanup for resume storage

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Layouts:
  - 1 column (mobile)
  - 2 columns (tablet)
  - 3 columns (desktop)
- Touch targets: Minimum 44x44px
- Safe area handling on iOS

### 🌐 Deployment & Compatibility
- Android, iOS, Web supported
- All major browsers supported
- Expo EAS for builds
- Netlify / Vercel / Firebase for web hosting

### 🔒 Security Checklist
- API keys secured
- Role-based access control
- Input validation
- HTTPS enforced
- Firebase rules strict
- File system permissions handled
- Comparison data scoped to user session

### 📝 Version Summary
- **Version**: 2.1.0
- **Status**: Production Ready & Optimized
- **Last Updated**: December 2025

**New Features in v2.1.0**:
- **Performance**: Asset pre-loading, FlatList virtualization.
- **Robustness**: Android secure file handling, Web resume self-healing.
- **Tracker**: Isolated data source, improved status logic.
- **UI**: Dynamic grids, smoother transitions.

**Previous Features**:
- AI Careers, Internships, ATS Scoring, Gamification
- Authentication, Profile Management
- Interactive UI components (hover effects)
- Full-width banner system
- Internship comparison system (2-4 items)

**Platforms**: Android, iOS, Web
