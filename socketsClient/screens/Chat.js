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
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box height={Platform.OS === "android" && "7%"} mt="3%" mb="2%" style={{alignItems: "center", width: "100%"}}>
        <HStack style={{justifyContent: "space-between", height: "100%", width: "90%", alignItems: "center", marginTop:3}}>
          <Heading style={Platform.OS === "ios" && {marginTop: 20, paddingBottom:30}}>
            {username}
          </Heading>
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
                let alt = chatData.name + " Avatar"
                return (
                  <Pressable
                    key={chatData.index}
                    onPress={() => {
                      navigation.navigate("Messaging", {
                        gr: chatData.index,
                        usr: chatData.name,
                        avtr: chatData.avatar,
                        mid: id
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

