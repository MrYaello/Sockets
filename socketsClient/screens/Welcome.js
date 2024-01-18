import React, { useState, useEffect, useLayoutEffect} from "react";
import { 
  ButtonText,
  Button,
  ButtonIcon,
  Text,
  Image,
  ArrowRightIcon,
  Box
  } from "@gluestack-ui/themed";
import { Pressable, SafeAreaView } from "react-native";
import socket from "../assets/utils/socket.js";

const Welcome = ({ navigation }) => {

  const goToLogin = () => {
    navigation.navigate("Login");
  }

  const goToRegister = () => {
    navigation.navigate("Register");
  }

  return (
    <SafeAreaView style={{
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#EEF1FF",
        alignItems: "center",
        padding: 12,
        width: "100%",
      }}>
        <Image
          size="xl"
          alt= "YLCode Logo"
          source={{
            uri: "http://ylcode.online:4000/uploads/logo512.png"
          }}
        />
        <Box width="100%" alignItems="center" justifyContent="flex-end" height="92%" style={{position: "absolute"}}>
        <Button width="80%" justifyContent="space-between" onPress={goToLogin}>
          <ButtonText>Sign in</ButtonText>
          <ButtonIcon as={ArrowRightIcon}/>
        </Button>
          <Box flexDirection="row">
            <Text size="md" mt="$2">You dont have an account?</Text>
            <Button size="md" pl="$1.5" pb={5} variant="link" onPress={goToRegister}>
              <ButtonText>Register</ButtonText>
            </Button>
          </Box>
        </Box>
    </SafeAreaView>
  )
}

export default Welcome;