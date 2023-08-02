import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rallyMind.app',
  appName: 'rallyMind',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
