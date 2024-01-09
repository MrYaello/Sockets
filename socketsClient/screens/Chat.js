import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native";
import styles from "../assets/utils/styles.js";
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
  AvatarFallbackText} from "@gluestack-ui/themed";

const Chat = ({ navigation }) => {
  const data = [
    {
      name: "Yael Lozano",
      msg: "Prr Prr Prr... Martillazo en el ano",
    },
    {
      name: "Luke Morales",
      msg: "🤓👆",
    },
    {
      name: "Cesar Villegas",
      msg: "Sexooooooo!",
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <Heading mt="$7">Chats</Heading>
      <Divider style={{elevation: 2}}/>
      <Box
        p="$6"
        $base-minWidth="100%">
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
      </Box>
      <Fab bg="$primary600" size="lg">
        <FabIcon as={EditIcon} /> 
      </Fab>
    </SafeAreaView>
  )
} 

export default Chat;

