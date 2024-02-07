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

const CODE_LENGTH = 4;

const ModalVerification = ({setVisible, email, setEmailVerified}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: CODE_LENGTH});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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
        onChangeText={setValue}
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
      onPress={() => {
        console.log(value);
        setVisible(false);
        setEmailVerified(true);
      }}
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