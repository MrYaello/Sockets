import React, { useState, useEffect, useLayoutEffect} from "react";
import { 
  FormControl,
  Box,
  FormControlLabel,
  FormControlLabelText, 
  InputField, 
  Input, 
  FormControlError, 
  FormControlErrorText, 
  FormControlErrorIcon, 
  AlertCircleIcon,
  ArrowRightIcon, 
  ButtonText,
  Button,
  ButtonIcon, 
  Text,
  LockIcon} from "@gluestack-ui/themed";
import { SafeAreaView, Image } from "react-native";
import socket from "../assets/utils/socket.js";
import styles from "../assets/utils/styles.js";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Temporal, estaría bien migrar a SQLite

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messagePassword, setMessagePassword] = useState("");
  const [messageUsername, setMessageUsername] = useState("");

  const handleSignIn = () => {
    var safeUsername = username.trim();
    if (!password.trim()) setMessagePassword("Obligaroy field.");
    if (!safeUsername) setMessageUsername("Obligaroy field.");
    else {
      socket.emit("validateUsername", safeUsername);
      socket.off("validateUsername").on("validateUsername", (response) => {
        if (response.length == 0) {
          setMessageUsername("Credentials not registered.");
        } else {
          socket.emit("login", safeUsername, password.trim());
          socket.off("login").on("login", (auth) => {
            if (auth.length == 0) {
              setMessagePassword("Invalid password.");
            } else {
              store("username", auth[0].username);
              navigation.navigate("Chat");
            }
          });
        }
      });
    }
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
      <Box style={{
        position: "absolute",
        flex: 1,
        height: "85%",
        justifyContent: "flex-start"
      }}>
        <Image
        alt= "YLCode Logo"
        source={{
          uri: "http://ylcode.online:4000/uploads/textlogo512.png"
        }}
        style={{
          height: 50,
          width: 100
        }}
        />
      </Box>
      <Box width="80%">
        <Text style={{
          alignSelf: "center",
          fontSize: 26,
          paddingTop: 10,
          marginBottom: 10,
        }}>Sign in </Text>
        <FormControl
          size="lg"
          isDisabled={false}
          isInvalid={messageUsername}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText>Username</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField 
              autoCorrect={false} 
              type="text" 
              defaultValue="" 
              placeholder="Username, Email or Phone number"
              onChangeText={(value) => {
                setUsername(value);
                setMessageUsername("");
              }}  
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messageUsername}</FormControlErrorText>
            {messageUsername=="Credentials not registered." ? <Button variant="link" style={{height: 22}} onPress={() => navigation.navigate("Register")}><ButtonText>Register?</ButtonText></Button> : ""}
          </FormControlError>
        </FormControl>

        <FormControl
          size="lg"
          isDisabled={false}
          isInvalid={messagePassword}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField 
              autoCorrect={false} 
              type="password" 
              defaultValue="" 
              placeholder="Password"
              onChangeText={(value) => {
                setPassword(value);
                setMessagePassword("");
              }}  
            />
          </Input>
          
          <FormControlError>
            <FormControlErrorIcon as={LockIcon}/>
            <FormControlErrorText>{messagePassword}</FormControlErrorText>{messagePassword=="Invalid password." ? <Button variant="link" style={{height: 22}}><ButtonText>Forgot?</ButtonText></Button> : ""}
          </FormControlError>
        </FormControl>
        <FormControl mt="$2">
          <Button 
            flexDirection="row"
            justifyContent="space-between"
            onPress={handleSignIn}
          >
            <ButtonText 
              fontSize="$sm" 
              fontWeight="$medium">
              Get Started
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon}/>
          </Button>
        </FormControl>
      </Box>
    </SafeAreaView>
  )
}

export default Login;