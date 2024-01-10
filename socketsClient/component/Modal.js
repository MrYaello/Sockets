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
        <Heading size="lg">Enter your Group Name</Heading>
        <ModalCloseButton>
          <Icon as={CloseIcon} />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>
      <Input
        variant="outline"
        size="md"
        >
        <InputField placeholder="Enter Text here"/>
      </Input>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          size="sm"
          action="secondary"
          mr="$5"
          onPress={() => {
            setVisible(false)
          }}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button
          size="sm"
          action="positive"
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