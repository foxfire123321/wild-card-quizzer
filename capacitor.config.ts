
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f545faf77f9a4d82841b7117ee1178cf',
  appName: 'wild-card-quizzer',
  webDir: 'dist',
  server: {
    url: 'https://f545faf7-7f9a-4d82-841b-7117ee1178cf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Ensure iOS and Android use the web URL for development
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: true,
  }
};

export default config;
