import React from 'react';

import Login from "./screens/Login"
import Messaging from "./screens/Messaging"
import Chat from "./screens/Chat"

import { config } from './config/gluestack-ui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import socket from "./assets/utils/socket.js";
import { GluestackUIProvider } from '@gluestack-ui/themed';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          {/*}
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerShown: false
            }}
          />
           */}
          <Stack.Screen
            name='Chat'
            component={Chat}
            options={{
              title: "Chats",
              headerShown: false
            }}
          />
          {/*
          <Stack.Screen
            name='Messaging'
            component={Messaging}
          />
          */}
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}