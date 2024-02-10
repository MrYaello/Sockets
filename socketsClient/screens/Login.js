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
  ArrowLeftIcon,
  ButtonText,
  Button,
  ButtonIcon, 
  Text,
  EyeOffIcon,
  LockIcon} from "@gluestack-ui/themed";
import { SafeAreaView, Image } from "react-native";
import socket from "../assets/utils/socket.js";
import styles from "../assets/utils/styles.js";
import sha256 from "sha256";
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (!password) setMessagePassword("Obligatory field.");
    if (!username) setMessageUsername("Obligatory field.");
    else {
      socket.emit("validateUsername", username);
      socket.off("validateUsername").on("validateUsername", (response) => {
        if (response.length == 0) {
          setMessageUsername("Credentials not registered.");
        } else {
          let salt = response[0].salt;
          socket.emit("login", username, sha256(salt+password));
          socket.off("login").on("login", (auth) => {
            if (auth.length == 0) {
              setMessagePassword("Invalid password.");
            } else {
              store("username", auth[0].username);
              store("id", String(auth[0].index));
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
        alt= "YLCode Text Logo"
        source={require('../assets/textlogo512.png')}
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
              autoCapitalize="none"
              type="text" 
              defaultValue="" 
              placeholder="Username, Email or Phone number"
              onChangeText={(value) => {
                setUsername(value.trim());
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
          <Box flexDirection="row">
            <Input width="84%" mr="2%">
              <InputField 
                autoCorrect={false}
                autoCapitalize="none" 
                type={showPassword ? "input" : "password"} 
                defaultValue="" 
                placeholder="Type your magic key"
                onChangeText={(value) => {
                  setPassword(value.trim());
                  setMessagePassword("");
                }}  
              />
            </Input>
            <Button variant="outline" width="14%" justifyContent="center" flexDirection="row" onPress={() => {setShowPassword(!showPassword)}}>
              <ButtonIcon ml="0" as={EyeOffIcon}/>
            </Button>
          </Box>
          
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
              Ready to go
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon}/>
          </Button>
        </FormControl>
        <Box flexDirection="row" pt="$1">
          <Button variant="link" p="$0" size="sm" onPress={() => {
            navigation.navigate("Welcome")
          }}>
            <ButtonIcon size="md" mr="$1" as={ArrowLeftIcon} />
            <ButtonText>Back to main</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  )
}

export default Login;