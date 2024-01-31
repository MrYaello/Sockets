import React, { useLayoutEffect, useState } from 'react';

import Login from "./screens/Login";
import Messaging from "./screens/Messaging";
import Chat from "./screens/Chat";
import Register from './screens/Register';
import Welcome from './screens/Welcome';

import { config } from './config/gluestack-ui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
            name='Welcome'
            component={Welcome}
            options={{
              headerShown: false
            }}
            />

            <Stack.Screen
            name='Register'
            component={Register}
            options={{
              headerShown: false
            }}
            />

            <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerShown: false
            }}
            />
          
            <Stack.Screen
              name='Chat'
              component={Chat}
              options={{
                title: "Chats",
                headerShown: false
              }}
            />

            <Stack.Screen
              name='Messaging'
              component={Messaging}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </GluestackUIProvider>
  );
}