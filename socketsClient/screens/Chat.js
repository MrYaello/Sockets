import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView, Platform, Pressable } from "react-native";
import styles from "../assets/utils/styles.js";
import ModalGroup from "../component/ModalGroup.js";
import ChatMenu from "../component/ChatMenu.js";
import ModalLogOut from "../component/ModalLogOut.js";
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

const chats = [
  {
    username: "Yael",
    avatar: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png",
    state: [
      {
        text: "SÍ O NOOOO ",
        date: new Date(2024, 0, 24, 17, 58, 57, null).toLocaleString(),
        user: "Yael",
      }, 
      {
        text: "O Q ROLLITO PRIMAVERAAAA",
        date: new Date(2024, 0, 24, 17, 59, 45, null).toLocaleString(),
        user: "Yael",
      }
    ]
  },
  {
    username: "Luki",
    avatar: "", //"https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png",
    state: [
      {
        text: "QUÉ BONITOS OJOS TIENES",
        date: new Date(2024, 0, 25, 19, 9, null).toLocaleString(),
        user: "Luki",
      },
      {
        text: "...",
        date: new Date(2024, 0, 25, 19, 10, null).toLocaleString(),
        user: "Luki",
      }
    ]
  }
];

const Chat = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [visibleModalLogOut, setVisibleModalLogOut] = useState(false);

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getId = async () => {
    try {
      const value = await AsyncStorage.getItem("id");
      if (value !== null) {
        setId(value);
        socket.emit("identify", id);
        socket.emit("requestUsers", false, value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useLayoutEffect(() => {
    getUsername();
    getId();
    socket.on("requestUsers", (response) => setData(response));
  }, []);

  useEffect(() => {
    socket.on("requestUsers", (response) => setData(response));
    console.log(data);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box height={Platform.OS === "android" && "7%"} mt="3%" mb="2%" style={{alignItems: "center", width: "100%"}}>
        <HStack style={{justifyContent: "space-between", height: "100%", width: "90%", alignItems: "center"}}>
          <Heading style={Platform.OS === "ios" && {marginTop: 10, paddingBottom:30}}>
            {username}
          </Heading>
          <ChatMenu username={username} setVisibleModalLogOut={setVisibleModalLogOut} />
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
                  ["uri"]: "" //chatData.avatar,
                }
                let alt = chatData.name + " Avatar"
                return (
                  <Pressable
                    key={chatData.index}
                    onPress={() => {
                      navigation.navigate("Messaging", {
                        gr: chatData.group_id,
                        usr: chatData.name,
                        st: chatData.state,
                        //avtr: chatData.avatar
                      });
                    }}
                  >
                    <HStack space="sm" alignItems="center">
                      <Avatar size="md">
                        <AvatarFallbackText>{chatData.name}</AvatarFallbackText>
                        <AvatarImage alt={alt} source={source}/>
                      </Avatar>
                      <VStack>
                        <Heading>{chatData.name}</Heading>
                        <Text>{chatData.state}</Text>
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
      {visible ? <ModalGroup setVisible={setVisible}/> : ""}
      {visibleModalLogOut ? <ModalLogOut setVisible={setVisibleModalLogOut} navigation={navigation}/> : ""}
    </SafeAreaView>
  )
} 

export default Chat;

