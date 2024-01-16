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
import { SafeAreaView } from "react-native";
import socket from "../assets/utils/socket.js";

const sendMail = (code, email) => {
  console.log("asd");
  socket.emit("testEmail", code, email);
}

const Register = ({ navigation }) => {
  return (
    <Button 
    mt="$20"
    flexDirection="row"
    justifyContent="space-between"
    onPress={sendMail("000000", "lozanoy6@gmail.com")}
  >
    <ButtonText 
      fontSize="$sm" 
      fontWeight="$medium">
      Register
    </ButtonText>
    <ButtonIcon as={ArrowRightIcon}/>
  </Button>
  );
}

export default Register;