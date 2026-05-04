import 'dotenv/config'

export default {
  expo: {
    name: 'FitnessFlow',
    slug: 'fitnessflow',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    updates: {
      url: 'https://u.expo.dev/9df8731d-cb84-4f1e-9ba7-8b17ce9720eb'
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    ios: {
      supportsTablet: false,
    },
    android: {
      package: 'com.yourname.fitnessflow',
    },
    extra: {
      eas: {
        projectId: '9df8731d-cb84-4f1e-9ba7-8b17ce9720eb'
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    }
  }
}