import {Menu, Button, MenuItem, Icon, MenuItemLabel, MenuIcon, Avatar, AvatarFallbackText, 
    AvatarImage, Text, HStack, VStack, Box } from "@gluestack-ui/themed";
import socket from "../assets/utils/socket";
import { useState, useEffect, useLayoutEffect } from "react";

const ChatMenu = ({username}) => {

    const [avatarSource, setAvatarSource] = useState();
    useLayoutEffect(() => {
        socket.emit("getAvatarSource", username);
        socket.on("getAvatarSource", (response) => setAvatarSource(response));
    }, [username]);
        
    return (
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
        <HStack alignItems="center" justifyContent="space-between" width="50%">
            <Avatar size="sm">
                <AvatarFallbackText>{username}</AvatarFallbackText>
                <AvatarImage alt={`${username} Avatar`} source={{uri: `${avatarSource}`}}/>
            </Avatar>
            <VStack ml="$1.5">
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