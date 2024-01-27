import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView, Platform, Pressable } from "react-native";
import styles from "../assets/utils/styles.js";
import Modal from "../component/ModalGroup.js";
import ChatMenu from "../component/ChatMenu.js";
import Messaging from "./Messaging.js";
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

const chats = [
  {
    username: "Yael",
    avatar: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png",
    state: [
      {
        text: "Quiero pene ",
        date: new Date(2024, 0, 24, 17, 58, 57, null).toLocaleString(),
      }, 
      {
        text: "wwwwwwwwwwwwwwwww",
        date: new Date(2024, 0, 24, 17, 59, 45, null).toLocaleString(),
      }
    ]
  },
  {
    username: "Luki",
    avatar: "", //"https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png",
    state: [
      {
        text: "Yo más AAAAAAAAA",
        date: new Date(2024, 0, 25, 19, 9).toISOString(),
      },
      {
        text: "Sexoooooo",
        date: new Date(2024, 0, 25, 19, 10).toISOString(),
      }
    ]
  }
];

const Chat = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    /*getStore("username", setUsername);
    socket.emit("requestUsers", false);
    socket.on("requestUsers", (response) => setData(response));*/
    setUsername("César Villegas");
    setData(chats);
  }, []);

  useEffect(() => {
    socket.on("requestUsers", (response) => setData(response));
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box height={Platform.OS === "android" && "7%"} mt="3%" mb="2%" style={{alignItems: "center", width: "100%"}}>
        <HStack style={{justifyContent: "space-between", height: "100%", width: "90%", alignItems: "center"}}>
          <Heading style={Platform.OS === "ios" && {marginTop: 10, paddingBottom:30}}>
            {username}
          </Heading>
          <ChatMenu username={username}/>
        </HStack>
      </Box>
      <Box
        pl="$3"
        $base-minWidth="100%"
        $base-minHeight="90%"
        style={Platform.OS === "ios" && {paddingTop: 30}}
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
                  <Pressable 
                    onPress={() => {
                      navigation.navigate("Messaging", {
                        usr: chatData.username,
                        st: chatData.state,
                        avtr: chatData.avatar
                      });
                    }}
                  >
                    <HStack space="sm" alignItems="center" key={chatData.index}>
                      <Avatar size="md">
                        <AvatarFallbackText>{chatData.username}</AvatarFallbackText>
                        <AvatarImage alt={alt} source={source}/>
                      </Avatar>
                      <VStack>
                        <Heading>{chatData.username}</Heading>
                        <Text>{chatData.state[1].text}</Text>
                      </VStack>
                    </HStack>
                  </Pressable>
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
          style={Platform.OS === "ios" && {marginBottom: 30}}
          >
          <FabIcon as={EditIcon} /> 
        </Fab>
      </Box>
      {visible ? <Modal setVisible={setVisible}/> : ""}
    </SafeAreaView>
  )
} 

export default Chat;

