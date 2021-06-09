import React, {useState, useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Platform, Keyboard, View} from 'react-native';
import {LiveMap} from '../screens/LiveMap';
import {Buses} from '../screens/Buses';
import {Trains} from '../screens/Trains';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import TrainIcon from '../../assets/train_icon.svg';
import MapIcon from '../../assets/map_icon_clean.svg';
import BusIcon from '../../assets/bus_icon.svg';

const Tab = createBottomTabNavigator();
const TrainStack = createStackNavigator();
const MapStack = createStackNavigator();
const BusStack = createStackNavigator();
const MapNavigator = () => {
  return (
    <MapStack.Navigator
      initialRouteName="LiveMap"
      screenOptions={{headerShown: false}}>
      <MapStack.Screen name="Live Map" component={LiveMap} />
    </MapStack.Navigator>
  );
};
const TrainNavigator = () => {
  return (
    <TrainStack.Navigator initialRouteName="Trains">
      <TrainStack.Screen name="Trains" component={Trains} />
    </TrainStack.Navigator>
  );
};
const BusNavigator = () => {
  return (
    <BusStack.Navigator
      initialRouteName="Buses"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
      }}>
      <BusStack.Screen name="Buses" component={Buses} />
    </BusStack.Navigator>
  );
};
const MainNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      style: {height: 100},
      activeTintColor: '#f4511e',
      keyboardHidesTabBar: true,
    }}
    initialRouteName="Live Map">
    <Tab.Screen
      name="Buses"
      component={BusNavigator}
      options={{
        tabBarLabel: 'Buses',
        tabBarIcon: ({color, size}) => (
          <View style={{paddingTop: 6}}>
            <BusIcon height={30} width={30} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Live Map"
      component={MapNavigator}
      options={{
        tabBarLabel: '',
        tabBarIcon: ({color}) => (
          <View
            height={100}
            width={100}
            style={{
              marginBottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: 50,
              paddingBottom: 4,
            }}>
            <MapIcon height={50} width={50} color="#f4511e" />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Trains"
      component={TrainNavigator}
      options={{
        tabBarLabel: 'Trains',
        tabBarIcon: ({color, size}) => (
          <View style={{paddingTop: 6}}>
            <TrainIcon height={30} width={30} color={color} />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainNavigator;
