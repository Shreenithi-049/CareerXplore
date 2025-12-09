# 🎓 CareerXplore - AI-Powered Career Recommendation Platform

> Helping students discover their perfect career path through AI-powered recommendations, skill matching, and personalized insights.

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue)]()
[![React Native](https://img.shields.io/badge/React%20Native-0.74.5-61DAFB)]()
[![Expo](https://img.shields.io/badge/Expo-51.0.0-000020)]()
[![Firebase](https://img.shields.io/badge/Firebase-10.12.0-FFCA28)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

---

## 📱 Live Demos

- **Android APK**: [Download](https://expo.dev/artifacts/eas/9gJQ2R3maDa1b8gjGb8qu5.apk)
- **Web App**: Deploy to Netlify/Vercel (see deployment section)

---

## ✨ Features

### 🎯 Core Features
- **AI-Powered Career Matching** - Gemini API integration for personalized recommendations
- **Skill-Based Recommendations** - Match careers based on your skills and interests
- **Live Internship Search** - Browse and apply to real internships
- **Application Tracker** - Track your application journey from applied to hired
- **Gamification System** - Earn XP, unlock badges, level up your profile
- **AI Chatbot Assistant** - 24/7 career guidance Q&A
- **Resume Analysis** - ATS-like scoring and improvement suggestions

### 🎨 UI/UX
- **Fully Responsive** - Works on mobile, tablet, and desktop
- **Modern Design** - Sleek gold accents with professional dark theme
- **Smooth Animations** - Pulsing effects, glows, and transitions
- **Touch Optimized** - 48px minimum touch targets (Apple/Google standards)

### 🔐 Security
- **Firebase Authentication** - Secure email/password login
- **Role-Based Access** - User data isolation
- **Security Rules** - Database-level protection

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI
- Firebase account
- Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/career-recommendation-app.git
cd career-recommendation-app

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npx expo start
```

### Run on Different Platforms

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform |
| **Firebase** | Backend & Authentication |
| **Gemini AI** | Career insights & recommendations |
| **React Navigation** | App navigation |
| **Expo Image Picker** | Profile picture upload |

---

## 🏗️ Project Structure

```
career-recommendation-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── InputField.js
│   │   ├── ChatbotWidget.js
│   │   └── ...
│   ├── screens/            # App screens
│   │   ├── HomeScreen.js
│   │   ├── CareerRecommendationScreen.js
│   │   ├── ProfileScreen.js
│   │   └── ...
│   ├── services/           # API & Firebase services
│   │   ├── firebaseConfig.js
│   │   ├── aiService.js
│   │   └── ...
│   ├── theme/              # Colors & styling
│   │   └── colors.js
│   └── utils/              # Helper functions
│       ├── useResponsive.js
│       └── profileUtils.js
├── assets/                 # Images & icons
├── App.js                  # Root component
├── app.config.js          # Expo configuration
└── eas.json               # Build configuration
```

---

## 🌐 Deployment

### Android (APK)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview

# Download APK from provided link
```

### Web (Netlify/Vercel)

```bash
# Build for web
npx expo export -p web

# Deploy to Netlify (drag & drop)
# Go to https://app.netlify.com/drop
# Drag the 'dist' folder

# Or deploy to Vercel
npm install -g vercel
vercel --prod
```

---

## 🎮 Gamification System

### XP Rewards
- Complete Profile: **100 XP**
- Add Skill: **10 XP**
- Upload Resume: **50 XP**
- Apply to Internship: **30 XP**
- View Career Details: **5 XP**

### Achievement Badges
- 🎯 **Skill Prodigy** - Add 5+ skills
- ⚡ **Fast Learner** - Earn 200+ XP
- 🔍 **Career Explorer** - View 10+ careers
- 🚀 **Go-Getter** - Apply to 5+ internships

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768-1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

### Features
- ✅ Hamburger menu on mobile
- ✅ Touch-optimized buttons (48px min)
- ✅ Responsive grids
- ✅ Adaptive layouts
- ✅ Desktop max-width (1200px)

---

## 🔑 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Update `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
```

---

## 🔐 Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Realtime Database
4. Copy config to `src/services/firebaseConfig.js`
5. Deploy security rules from `firebase-database-rules-updated.json`

---

## 📚 Documentation

- **[Technical Documentation](CAREERXPLORE_TECHNICAL_DOCUMENTATION.md)** - Complete technical guide
- **[API Setup](API_SETUP.md)** - Gemini API configuration
- **[Firebase Security](FIREBASE_SECURITY_SETUP.md)** - Security rules setup
- **[Architecture](ARCHITECTURE_DIAGRAM.md)** - System architecture
- **[Web Deployment](WEB_DEPLOYMENT.md)** - Web deployment guide
- **[Responsive Design](RESPONSIVE_COMPLETE.md)** - Responsive implementation

---

## 🧪 Testing

### Manual Testing
```bash
# Run on Android emulator
npx expo start --android

# Run on iOS simulator
npx expo start --ios

# Run on web browser
npx expo start --web
```

### Test Accounts
- **Student**: student@test.com / password123
- **Admin**: admin@careerxplore.com / admin123

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Gemini API not working**
```bash
# Check API key in .env
# Verify quota not exceeded
# Check network connectivity
```

**Issue: Firebase permission denied**
```bash
# Deploy security rules
# Verify user is authenticated
# Check database structure
```

**Issue: Build fails**
```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📈 Performance

- ⚡ Fast loading with optimized builds
- 🔄 Real-time updates with Firebase
- 💾 Offline support with Firebase persistence
- 🎨 Smooth animations with native driver
- 📦 Code splitting for web

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

- **Developer**: Your Name
- **AI Integration**: Gemini API
- **Backend**: Firebase
- **Design**: Custom UI/UX

---

## 🙏 Acknowledgments

- Google Gemini AI for career insights
- Firebase for backend infrastructure
- Expo for cross-platform development
- React Native community

---

## 📞 Support

For support, email support@careerxplore.com or open an issue.

---

## 🔮 Roadmap

- [ ] Push notifications
- [ ] Video tutorials
- [ ] Resume builder
- [ ] Interview prep
- [ ] Skill assessments
- [ ] Job board
- [ ] Networking features
- [ ] Mobile app (iOS)

---

**Made with ❤️ for students worldwide**

**Version**: 1.1.0 | **Status**: Production Ready ✅
