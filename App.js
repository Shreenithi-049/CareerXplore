import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import AppNavigator from "./src/navigation/AppNavigator";
import { ComparisonProvider } from "./src/context/ComparisonContext";

import 'react-native-reanimated';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load images used in headers
        await Asset.loadAsync([
          require('./assets/homepage.jpg'),
          require('./assets/internship_header.jpeg'),
          require('./assets/careerrecommendation_header.webp'),
        ]);
        // Artificially delay for a smooth experience
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync().catch(() => { });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ComparisonProvider>
        <AppNavigator />
      </ComparisonProvider>
    </View>
  );
}
