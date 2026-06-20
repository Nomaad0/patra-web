import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.patra.app',
  appName: 'PaTra',
  webDir: 'build',
  // Sur iOS, WKWebView — pas de service worker natif, on désactive
  ios: {
    contentInset: 'always', // respect safe areas (Dynamic Island, home bar)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#060a11',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#060a11',
    },
  },
};

export default config;
