import 'dotenv/config';

export default {
  experiments: {
    reactNativeNewArchitecture: false,
  },
  extra: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};
