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
  CheckIcon,
  LockIcon} from "@gluestack-ui/themed";
import { SafeAreaView, Image, Keyboard } from "react-native";
import socket from "../assets/utils/socket.js";
import sha256 from "sha256";
import styles from "../assets/utils/styles.js";

const sendMail = (code, email) => {
  socket.emit("sendVerificationEmail", code, email);
}

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [messagePassword, setMessagePassword] = useState("");
  const [messageUsername, setMessageUsername] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messagePhonenumber, setMessagePhonenumber] = useState("");
  // ^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$ Regex Email
  const handleRegister = () => {
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

  const verifyEmail = () => {
    var safeEmail = email.trim();
    if (safeEmail) setMessageEmail("Obligatory field.");
    if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(safeEmail))) setMessageEmail("Type a valid email.");
  }

  return (
    <SafeAreaView style={{
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#EEF1FF",
        alignItems: "center",
        padding: 12,
        width: "100%",
        height: "100%"
      }}>
      <Box style={{
        position: "absolute",
        flex: 1,
        height: "100%",
        paddingTop: "16%",
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
          fontSize: 26,
          paddingTop: 10,
          marginBottom: 10,
          alignSelf: "center"
        }}>Register </Text>
        <FormControl
          size="lg"
          isDisabled={false}
          isInvalid={messageEmail}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Box flexDirection="row">
          <Input width="68%">
            <InputField 
              autoCorrect={false} 
              type="text" 
              defaultValue=""
              placeholder="Where could we email you?"
              onChangeText={(value) => {
                setEmail(value);
                setMessageEmail("");
              }}  
            />
          </Input>
          <Button width="28%" ml="4%" flexDirection="row" justifyContent="center" onPress={verifyEmail}>
            <ButtonText>Verify</ButtonText>
            <ButtonIcon ml="$2" as={CheckIcon}/>
          </Button>
          </Box>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messageEmail}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        
        <FormControl
          size="lg"
          isDisabled={!emailVerified}
          isInvalid={messagePhonenumber}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText color={!emailVerified ? "$textLight400" : "$black"}>Phone number</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField 
              autoCorrect={false} 
              type="text" 
              defaultValue="" 
              placeholder="Where should we call you?"
              onChangeText={(value) => {
                setPhonenumber(value);
                setMessagePhonenumber("");
              }}  
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messagePhonenumber}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          size="lg"
          isDisabled={!emailVerified}
          isInvalid={messageUsername}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText color={!emailVerified ? "$textLight400" : "$black"}>Username</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField 
              autoCorrect={false} 
              type="text" 
              defaultValue="" 
              placeholder="Choose your alter ego"
              onChangeText={(value) => {
                setUsername(value);
                setMessageUsername("");
              }}  
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText></FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          size="lg"
          isDisabled={!emailVerified}
          isInvalid={messagePassword}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText color={!emailVerified ? "$textLight400" : "$black"}>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField 
              autoCorrect={false} 
              type="password" 
              defaultValue="" 
              placeholder="Forge the key to your digital realm"
              onChangeText={(value) => {
                setPassword(value);
                setMessagePassword("");
              }}  
            />
          </Input>
          
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText></FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl 
          mt="$2"
        >
          <Button 
            flexDirection="row"
            justifyContent="space-between"
            isDisabled={!emailVerified}
          >
            <ButtonText 
              fontSize="$sm" 
              fontWeight="$medium">
              Start the odyssey
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

export default Register;