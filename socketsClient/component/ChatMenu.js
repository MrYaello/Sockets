import {Menu, Button, MenuItem, Icon, MenuItemLabel, MenuIcon, Avatar, AvatarFallbackText, 
    AvatarImage, Text, HStack, VStack, Box } from "@gluestack-ui/themed";
import socket from "../assets/utils/socket";
import { useState, useEffect } from "react";

const ChatMenu = ({username}) => {

    const [avatarSource, setAvatarSource] = useState();

    useEffect(() => {
        const handleGetAvatarSource = (response) => {
          setAvatarSource(response);
        };
    
        socket.emit("getAvatarSource", username);
    
        socket.on("getAvatarSource", handleGetAvatarSource);
    
        return () => {
          socket.off("getAvatarSource", handleGetAvatarSource);
        };
      }, [username]);
        
    return(
    <Menu
    placement="left"
    trigger={({ ...triggerProps }) => {
        return (
        <Button {...triggerProps}>
            <Icon size="2xl" as={MenuIcon}></Icon> 
        </Button>
        )
    }}
    >   
    <MenuItem key="Perfil" textValue="Perfil">
        {/* PuzzleIcon is imported from 'lucide-react-native' */}
        {/* <Icon as={PuzzleIcon} size="sm" mr="$2" /> */}
        {/* <MenuItemLabel size="sm">Profile</MenuItemLabel> */}
        <HStack>
            <Avatar size="sm">
                <AvatarFallbackText>{username}</AvatarFallbackText>
                <AvatarImage alt={`${username} Avatar`} source={{uri: `${avatarSource}`}}/>
            </Avatar>
            <VStack>
                <Box>
                    <Text size="lg">{username}</Text>
                </Box>
            </VStack>
        </HStack>
    </MenuItem>
    <MenuItem key="Add account" textValue="Add account">
        {/* <Icon as={AddIcon} size="sm" mr="$2" /> */}
        <MenuItemLabel size="sm">Log out</MenuItemLabel>
    </MenuItem>
    </Menu>
)}

export default ChatMenu;