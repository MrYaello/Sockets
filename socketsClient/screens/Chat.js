import React, { useState, useEffect, useLayoutEffect } from "react";
import { Pressable, SafeAreaView, Platform } from "react-native";
import styles from "../assets/utils/styles.js";
import Modal from "../component/Modal";
import { 
  Box,
  VStack,
  HStack,
  Avatar,
  AvatarImage,
  Text,
  Heading,
  Fab,
  FabIcon,
  EditIcon, 
  Divider,
  AvatarFallbackText,
  ScrollView
} from "@gluestack-ui/themed";
import socket from "../assets/utils/socket.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const Chat = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  useLayoutEffect(() => {
    getStore("username", setUsername);
    socket.emit("requestUsers", false);
    socket.on("requestUsers", (response) => setData(response));
  }, []);
  useEffect(() => {
    socket.on("requestUsers", (response) => setData(response));
  })

  return (
    <SafeAreaView style={styles.safeArea}>
      <Heading mt={Platform.OS === "android" && "7%"} mb="2%">{username}</Heading>
      <Box
        pl="$3"
        $base-minWidth="100%"
        $base-minHeight="91%"
        >
        {(data.length > 0) 
        ? (
          <ScrollView height={100}>
            <VStack space="lg">
              {data.map((chatData) => {
                let source = {
                  ["uri"]: chatData.avatar,
                }
                let alt = chatData.username + " Avatar"
                return (
                  <HStack space="sm" alignItems="center" key={chatData.index}>
                    <Avatar size="md">
                      <AvatarFallbackText>{chatData.username}</AvatarFallbackText>
                      <AvatarImage alt={alt} source={source}
                      />
                    </Avatar>
                    <VStack>
                      <Heading>{chatData.username}</Heading>
                      <Text>{chatData.state}</Text>
                    </VStack>
                  </HStack>
                )
              })}
            </VStack>
          </ScrollView>
          ) 
          : ( 
            <Text>Click the icon to start a new Chat!</Text>
          )}
        <Fab 
          bg="$primary600" size="lg" 
          onPress={() => {setVisible(true)}}
          >
          <FabIcon as={EditIcon} /> 
        </Fab>
      </Box>
      {visible ? <Modal setVisible={setVisible}/> : ""}
    </SafeAreaView>
  )
} 

export default Chat;

