import { Modal, ModalBackdrop, ModalContent, ModalHeader, Heading,
         ModalCloseButton, Icon, ModalBody, Text, ModalFooter, 
         Button, ButtonText, CloseIcon, Input, InputField } from "@gluestack-ui/themed"
import React, { useState } from "react";

export default ({setVisible}) => (
    <Modal
    isOpen={true}
    onClose={() => {
      setVisible(false)
    }}
  >
    <ModalBackdrop />
    <ModalContent>
      <ModalHeader>
        <Heading size="lg">Create Group Chat</Heading>
        <ModalCloseButton>
          <Icon as={CloseIcon} />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>
      <Input
        variant="outline"
        size="md"
        >
        <InputField placeholder="Type group chat name..."/>
      </Input>
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
          }}
        >
          <ButtonText>Create</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>  )