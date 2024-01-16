import React, { useLayoutEffect, useState } from 'react';

import Login from "./screens/Login"
import Messaging from "./screens/Messaging"
import Chat from "./screens/Chat"

import { config } from './config/gluestack-ui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import socket from "./assets/utils/socket.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const getStore = async (key, setter) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      setter(value);
    }
  } catch (e) {
    console.error(e);
  }
};

export default function App() {
  const [username, setUsername] = useState("");
  useLayoutEffect(() => {
    getStore("username", setUsername);
  }, []);
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        {(username == "") 
        ? (
          <Stack.Navigator>
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
          </Stack.Navigator>
          ) 
          : (
          <Stack.Navigator>
            <Stack.Screen
              name='Chat'
              component={Chat}
              options={{
                title: "Chats",
                headerShown: false
              }}
            />
          </Stack.Navigator>
          )}
          {/*
          <Stack.Screen
            name='Messaging'
            component={Messaging}
          />
          */}
      </NavigationContainer>
      <StatusBar style="dark" />
    </GluestackUIProvider>
  );
}