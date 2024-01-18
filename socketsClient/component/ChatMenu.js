import { Menu, MenuItem, MenuItemLabel, MenuIcon, Button, Icon, Avatar, AvatarFallbackText, 
    AvatarImage, Text, HStack, VStack, Box } from "@gluestack-ui/themed";
import socket from "../assets/utils/socket";
import { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet } from "react-native";

const ChatMenu = ({username}) => {

    const [avatarSource, setAvatarSource] = useState();
    useLayoutEffect(() => {
        socket.emit("getAvatarSource", username);
        socket.on("getAvatarSource", (response) => setAvatarSource(response));
    }, [username]);
        
    return (
    <Menu 
    placement="bottom right"
    trigger={({ ...triggerProps }) => {
        return (
        <Button {...triggerProps} style={styles.menu} size="md">
            <Icon size="xl" as={MenuIcon}></Icon> 
        </Button>
        )
    }}
    >   
    <MenuItem key="Perfil" textValue="Perfil">
        {/* PuzzleIcon is imported from 'lucide-react-native' */}
        {/* <Icon as={PuzzleIcon} size="sm" mr="$2" /> */}
        {/* <MenuItemLabel size="sm">Profile</MenuItemLabel> */}
        <HStack alignItems="center" justifyContent="space-between" width="60%">
            <Avatar size="md">
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

const styles = StyleSheet.create({
    menu: {
        marginTop: 15,
        borderRadius: 13,
    }
});

export default ChatMenu;