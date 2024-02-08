import { Modal, ModalBackdrop, ModalContent, ModalHeader, Heading,
    ModalCloseButton, Icon, ModalBody, Text, ModalFooter, 
    Button, ButtonText, CloseIcon, CheckIcon, ButtonIcon, Box } from "@gluestack-ui/themed";
import { View, StyleSheet } from 'react-native';    
import React, { useState } from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import socket from "../assets/utils/socket";

const CODE_LENGTH = 4;

const ModalVerification = ({setVisible, email, setEmailVerified}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const ref = useBlurOnFulfill({value, cellCount: CODE_LENGTH});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const verifyEmail = () => {
    if (value.length < 4) setError(true);
    else {
      socket.emit("verifyEmailCode", email);
      socket.off("verifyEmailCode").on("verifyEmailCode", (result) => {
        if (result == value) {
          setEmailVerified(true);
          setVisible(false);
        } 
        else { 
          setError(true);
          setErrorMessage("The code is invalid. Try Again.")
        }
      });
    }
  };

return (
  <Modal
  isOpen={true}
  onClose={() => {
  setVisible(false);
  }}
  >
  <ModalBackdrop/>
  <ModalContent>
  <ModalHeader>
    <Heading size="lg">Verify your email</Heading>
    <ModalCloseButton>
      <Icon as={CloseIcon} />
    </ModalCloseButton>
  </ModalHeader>
  <ModalBody>
      <Box style={{
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Text>A verification code was send to</Text>
        <Text color="$primary600">{email}</Text>
      </Box>
      <Box style={style.root}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={(value) => {
          setValue(value);
          setErrorMessage("");
          setError(false);
        }}  
        cellCount={CODE_LENGTH}
        rootStyle={style.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[style.cellRoot, isFocused && style.focusCell, error && style.error]}>
            <Text style={style.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      </Box>
      <Box style={{
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Text color="$error400">{errorMessage}</Text>
      </Box>
  </ModalBody>
  <ModalFooter>
    <Button
      variant="outline"
      size="sm"
      mr="$2"
      onPress={() => {
        setVisible(false)
      }}
    >
      <ButtonText>Go Back</ButtonText>
    </Button>
    <Button
      size="sm"
      borderWidth="$0"
      onPress={verifyEmail}
    >
      <ButtonText>Verify Email</ButtonText>
      <ButtonIcon ml="$2" as={CheckIcon}/>
    </Button>
  </ModalFooter>
  </ModalContent>
  </Modal>
)};

const style = StyleSheet.create({
  root: {padding: 20, height: 100, width: "100%"},
  codeFiledRoot: {
    marginTop: 10,
    width: "100%",
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#4f46e5',
    borderBottomWidth: 2,
  },
  error: {
    borderBottomColor: '#E63535',
    borderBottomWidth: 2,
  }
});

export default ModalVerification;