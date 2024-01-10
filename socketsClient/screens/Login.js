import React, { useState, useEffect} from "react";
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
  ButtonIcon } from "@gluestack-ui/themed";
import { SafeAreaView, Text } from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [isInvalid, setInvalid] = useState(false);
  var invalid;
  //const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (username.trim().length >= 8) {
      console.log(username);
      navigation.navigate("Chat");
    } else {
      setInvalid(true);
    }
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#EEF1FF",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      width: "100%",
    }}>
      <Box 
        h="$32"
        w="$72"
      >
        <Text style={{
          alignSelf: "center",
          fontSize: 26,
          marginBottom: 10,
        }}>Sign in </Text>
        <FormControl
          size="lg"
          isDisabled={false}
          isInvalid={isInvalid}
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
              placeholder="Enter your username."
              onChangeText={(value) => {
                setUsername(value);
                setInvalid(false);
              }}  
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>At least 8 characters requiered.</FormControlErrorText>
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