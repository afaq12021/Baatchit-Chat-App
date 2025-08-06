import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import BottomTab from './BottomTab';



const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="splash-screen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash-screen" component={SplashScreen} />
        <Stack.Screen name="main" component={BottomTab} />
        <Stack.Screen name="chat" component={ChatScreen} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
