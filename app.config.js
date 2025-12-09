import 'dotenv/config';

export default {
  expo: {
    name: "Career Recommendation App",
    slug: "career-recommendation-app",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.student.careerportal"
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
      name: "Career Recommendation Portal",
      backgroundColor: "#ffffff",
      display: "standalone"
    },
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: "46230aea-bdfa-4517-9dd7-e56af8f14974"
      }
    }
  }
};
