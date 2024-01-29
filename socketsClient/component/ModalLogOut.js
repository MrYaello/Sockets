import { Modal, ModalBackdrop, ModalContent, ModalHeader, Heading,
    ModalCloseButton, Icon, ModalBody, Text, ModalFooter, 
    Button, ButtonText, CloseIcon } from "@gluestack-ui/themed"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({setVisible, navigation}) => (
<Modal
isOpen={true}
onClose={() => {
 setVisible(false)
}}
>
<ModalBackdrop />
<ModalContent>
 <ModalHeader>
   <Heading size="lg">Confirmation</Heading>
   <ModalCloseButton>
     <Icon as={CloseIcon} />
   </ModalCloseButton>
 </ModalHeader>
 <ModalBody>
    <Text>Are you sure you want to log out?</Text>
 </ModalBody>
 <ModalFooter>
   <Button
     variant="outline"
     size="sm"
     mr="$5"
     onPress={() => {
       setVisible(false)
     }}
   >
     <ButtonText>Cancel</ButtonText>
   </Button>
   <Button
     size="sm"
     borderWidth="$0"
     onPress={() => {
       setVisible(false)
       AsyncStorage.clear()
       navigation.navigate('Welcome')
     }}
   >
     <ButtonText>Log out</ButtonText>
   </Button>
 </ModalFooter>
</ModalContent>
</Modal>  
)