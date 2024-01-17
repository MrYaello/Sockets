import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView, Platform } from "react-native";
import styles from "../assets/utils/styles.js";
import Modal from "../component/ModalGroup.js";
import ChatMenu from "../component/ChatMenu.js";
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
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box height={Platform.OS === "android" && "7%"} mt="3%" mb="2%" style={{alignItems: "center", width: "100%"}}>
        <HStack style={{justifyContent: "space-between", height: "100%", width: "90%", alignItems: "center"}}>
          <Heading>{username}</Heading>
          <ChatMenu username={username}/>
        </HStack>
      </Box>
      <Box
        pl="$3"
        $base-minWidth="100%"
        $base-minHeight="90%"
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
                      <AvatarImage alt={alt} source={source}/>
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

