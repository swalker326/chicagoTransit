import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import {AppProvider} from './src/state/contexts/appContext';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  });

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
