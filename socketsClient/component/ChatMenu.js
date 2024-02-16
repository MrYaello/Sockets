import { MenuIcon, Button, Icon, Avatar, AvatarFallbackText, AvatarImage, Text, HStack, VStack, Box, Actionsheet, 
    ActionsheetBackdrop, ActionsheetContent, ActionsheetItem, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, 
    ActionsheetItemText } from "@gluestack-ui/themed";
import socket from "../assets/utils/socket";
import { useState, useLayoutEffect } from "react";
import { Platform, StyleSheet } from "react-native";

const ChatMenu = ({username, setVisibleModalLogOut}) => {

    const [avatarSource, setAvatarSource] = useState();
    useLayoutEffect(() => {
        socket.emit("getAvatarSource", username);
        socket.on("getAvatarSource", (response) => setAvatarSource(response));
    }, [username]);
    const [showActionsheet, setShowActionsheet] = useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const handleLogOut = () => {
        handleClose();
        setVisibleModalLogOut(true);
    }
        
    return (
        <Box>
            <Button onPress={handleClose} style={styles.menu} size="md">
                <Icon size="xl" as={MenuIcon}></Icon>
            </Button>
            <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={900}>
                <ActionsheetBackdrop/>
                <ActionsheetContent h="$72" zIndex={999}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetItem onPress={handleLogOut}>
                        <HStack alignItems="center" justifyContent="space-between" width="50%">
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
                    </ActionsheetItem>
                    <ActionsheetItem onPress={handleLogOut}>
                        <ActionsheetItemText>Log out</ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
        </Box>
)}

const styles = StyleSheet.create({
    menu: {
        marginTop: -10,
        borderRadius: 13,
        maxWidth: 50,
        marginLeft: Platform.OS === 'ios' ? '75%' : '30%',
        position: "absolute"
    }
});

export default ChatMenu;