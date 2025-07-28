// app.config.js

export default {
  expo: {
    name: "videoverse",
    slug: "videoverse-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/videoverse.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    jsEngine: "jsc",
    splash: {
      image: "./assets/videoverse.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anish_kh_007.videoversemobile",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-font",
    ],
    extra: {
      eas: {
        projectId: "b9edcbda-8ed5-4e58-939b-cb498c319197",
      },
    },
  },
};
