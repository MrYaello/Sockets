import React, { useState, useEffect, useLayoutEffect } from "react";
import { Pressable, SafeAreaView } from "react-native";
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
  AvatarFallbackText
} from "@gluestack-ui/themed";

const Chat = ({ navigation }) => {

  const [visible, setVisible] = useState(false);

  const data = [
    {
      index : 0,
      name: "Yael Lozano",
      msg: "Trr Trr Trr... Martillazo en el ano",
    },
    {
      index : 1,
      name: "Luke Morales",
      msg: "🤓👆yo",
    },
    {
      index : 2,
      name: "Cesar Villegas",
      msg: "Sexooooooo!",
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <Heading mt="$7">Chats</Heading>
      <Divider style={{elevation: 2}}/>
      <Box
        p="$3"
        $base-minWidth="100%"
        $base-minHeight="15%"
        >
        {(data.length > 0) 
        ? (
          <VStack space="md">
            {data.map((chatData) => {
              return (
                <HStack space="sm" alignItems="center" key={chatData.index}>
                  <Avatar size="sm">
                    <AvatarFallbackText>{chatData.name}</AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <Heading size="xs">{chatData.name}</Heading>
                    <Text size="xs">{chatData.msg}</Text>
                  </VStack>
                </HStack>
              )
            })}
          </VStack>
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

