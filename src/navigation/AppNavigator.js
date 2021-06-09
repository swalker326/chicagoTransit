import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Splash} from '../screens/Splash';
import {LiveMap} from '../screens/LiveMap';
import MainNavigator from './MainNavigator';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {isLoading && (
            // We haven't finished checking for the token yet
            <RootStack.Screen name="Splash" component={Splash} />
          )}
          <RootStack.Screen name="App" component={MainNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
