import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thakorsamajsangthan.app',
  appName: 'Thakor Samaj Sangathan',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;