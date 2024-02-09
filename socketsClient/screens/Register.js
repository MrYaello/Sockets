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
  EyeIcon,
  EyeOffIcon,
  Icon,
  LockIcon} from "@gluestack-ui/themed";
import { SafeAreaView, Image, Keyboard } from "react-native";
import socket from "../assets/utils/socket.js";
import ModalVerification from "../component/ModalVerification.js";
import sha256 from "sha256";
import styles from "../assets/utils/styles.js";

var buttonCooldown = "Verify";
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
  const cooldown = 60 * 0.5;
  const [time, setTime] = useState(cooldown);
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleModalVerify, setVisibleModalVerify] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      buttonCooldown = `${Math.floor(time / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
      interval = setInterval(() => {
        setTime(time - 1);
      }, 10);
    } else {
      buttonCooldown = "Verify";
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setTime(cooldown)
      buttonCooldown = "Verify";
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleRegister = () => {
    if (!password) setMessagePassword("Obligaroy field.");
    if (!phonenumber) setMessagePhonenumber("Obligatory field.");
    else if (phonenumber.length < 10) setMessagePhonenumber("Type a valid phonenumber.")
    if (!username) setMessageUsername("Obligaroy field.");
    if (username.length > 16) setMessageUsername("Username lenght must be less than 16.")
    if (!messagePhonenumber && !messageUsername && !messagePassword) {
      socket.emit("validateUsername", phonenumber);
      socket.off("validateUsername").on("validateUsername", (response) => {
        if (response.length != 0) {
          setMessagePhonenumber("Phonenumber already registered.");
        } else {
          socket.emit("validateUsername", username);
          socket.off("validateUsername").on("validateUsername", (response) => {
            if (response.length != 0) {
              setMessageUsername("Username already registered.");
            } else {
              let salt = (Math.random() + 1).toString(36).substring(2, 10);
              socket.emit("register", username, salt, sha256(salt+password), email, phonenumber);
            }
          });
        }
      });
    }
  }

  const verifyEmail = () => {
    var email = email;
    if (!email) setMessageEmail("Obligatory field.");
    else if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email))) setMessageEmail("Type a valid email.");
    else {
      socket.emit("validateUsername", email);
      socket.off("validateUsername").on("validateUsername", (response) => {
        if (response.length == 0) {
          setVisibleModalVerify(true);
          setIsActive(true);
          socket.emit("sendVerificationEmail", email);
        } else {
          setMessageEmail("Credentials already registered.");
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
        height: "100%"
      }}>
      <Box width="80%">
        <Text style={{
          fontSize: 26,
          paddingTop: 10,
          marginBottom: 10,
          alignSelf: "center"
        }}>Register </Text>
        <FormControl
          size="lg"
          isDisabled={emailVerified}
          isInvalid={messageEmail}
          isReadOnly={false}
          isRequiered={true}
        >
          <FormControlLabel mb="$1">
            <FormControlLabelText color={emailVerified ? "$primary600" : "$black"}>{emailVerified ? "Email Verified" : "Email"}</FormControlLabelText>
          </FormControlLabel>
          <Box flexDirection="row">
          <Input width={emailVerified ? "100%" : "72%"}>
            <InputField 
              autoCorrect={false}
              autoCapitalize="none"
              type="text" 
              defaultValue=""
              placeholder="Where could we email you?"
              onChangeText={(value) => {
                setEmail(value.trim());
                setMessageEmail("");
              }}  
            />
          </Input>
          
          {!emailVerified ? <Button width="27%" ml="1%" flexDirection="row" justifyContent="center" onPress={verifyEmail} isDisabled={isActive}>
            <ButtonText>{buttonCooldown}</ButtonText>
            <ButtonIcon ml="$2" as={CheckIcon}/>
          </Button> : "" }
          </Box>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messageEmail}</FormControlErrorText>
            {messageEmail=="Credentials already registered." ? <Button variant="link" style={{height: 22}} onPress={() => navigation.navigate("Login")}><ButtonText>Login?</ButtonText></Button> : ""}
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
              autoCapitalize="none"
              keyboardType="number-pad"
              type="text" 
              defaultValue="" 
              placeholder="Where should we call you?"
              onChangeText={(value) => {
                setPhonenumber(value.trim());
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
              autoCapitalize="none"
              type="text" 
              defaultValue="" 
              placeholder="Choose your alter ego"
              onChangeText={(value) => {
                setUsername(value.trim());
                setMessageUsername("");
              }}  
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messageUsername}</FormControlErrorText>
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
          <Box flexDirection="row">
            <Input width="84%" mr="2%">
              <InputField 
                autoCorrect={false}
                autoCapitalize="none" 
                type={showPassword ? "input" : "password"} 
                defaultValue="" 
                placeholder="Forge the key to your digital realm"
                onChangeText={(value) => {
                  setPassword(value.trim());
                  setMessagePassword("");
                }}  
              />
            </Input>
            <Button variant="outline" width="14%" justifyContent="center" flexDirection="row" onPress={() => {setShowPassword(!showPassword)}} isDisabled={!emailVerified}>
              <ButtonIcon ml="0" as={EyeOffIcon}/>
            </Button>
          </Box>
          
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{messagePassword}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl 
          mt="$2"
        >
          <Button 
            flexDirection="row"
            justifyContent="space-between"
            isDisabled={!emailVerified}
            onPress={handleRegister}
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
      <Box style={{
        position: "absolute",
        flex: 1,
        height: "100%",
        flexDirection: "column-reverse",
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
      {visibleModalVerify ? <ModalVerification setVisible={setVisibleModalVerify} email={email} setEmailVerified={setEmailVerified}/> : ""}
    </SafeAreaView>
  )
}

export default Register;