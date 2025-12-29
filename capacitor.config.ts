import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thakorsamajsangthan.app',
  appName: 'Thakor Samaj Sangathan',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false
    },
    // ✅ સ્પ્લેશ સ્ક્રીનનું સેટિંગ અહીં ઉમેર્યું છે
    SplashScreen: {
      backgroundColor: '#800000', // આ મરૂન કલર છે
      launchShowDuration: 3000,   // ૩ સેકન્ડ દેખાશે
      launchAutoHide: true,
      showSpinner: false,         // ગોળ ફરતું ચક્ર કાઢી નાખ્યું છે (રાખવું હોય તો true કરો)
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;