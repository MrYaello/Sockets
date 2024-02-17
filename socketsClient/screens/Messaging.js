import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { 
    ScrollView, 
    Text, 
    Box, 
    Icon, 
    HStack, 
    VStack, 
    Heading,
    Button, 
    ButtonIcon, 
    ButtonText,
    Alert, 
    Avatar,
    AvatarImage,
    AvatarFallbackText,
    Badge,
    BadgeText, 
    BadgeIcon,
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Input,
    InputField,
} from "@gluestack-ui/themed";
import socket from "../assets/utils/socket.js";
import { ChevronLeftIcon, CircleIcon, MenuIcon, CheckCircleIcon, GripVerticalIcon} from "@gluestack-ui/themed";
import { Camera, Zap } from "lucide-react-native";

let messageHeight="82%";
let actionBoxHeight="18%";

const Messaging = ({ route, navigation }) => {
    const { gr, usr, avtr, mid } = route.params;

    const group = JSON.stringify(gr);//.replace(/^"(.*)"$/, '$1');
    const username = JSON.stringify(usr).replace(/^"(.*)"$/, '$1');
    const avatar = JSON.stringify(avtr).replace(/^"(.*)"$/, '$1');
    const id = JSON.stringify(mid).replace(/^"(.*)"$/, '$1');
    const [messages, setMessages] = useState([]);

    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const textRef = useRef(null);
    const [placeholderIsSelected, setPlaceholderIsSelected] = useState(false);
    const [keyboardIsUp, setKeyboardIsUp] = useState(false);

    /*const [bubbleDimensions, setBubbleDimensions] = useState({
        width: 250,
        height: 80,
    });*/

    const getBack = () => {
        navigation.navigate("Chat");
    }

    let alt = "\"" + username + "\"" + " Avatar";
    let src = { 
        ["uri"]: avatar, 
    };

    function measure(text) {
        if (text.length <= 32) {
            const resultWidth = text.length * 20 + 30;
            return resultWidth <= 250 ? resultWidth : 250;
        } else return 250;
    };

    useEffect(() => {
        socket.emit("deployMessages", group);
        socket.off("deployMessages").on("deployMessages", (response) => {
            setMessages(response);
        });
    }, []);

    return (
        <SafeAreaView>
            <Box style={styles.headingBox}>
                <HStack style={{alignItems: "center", paddingTop: 10, }} >
                    <Button 
                        size="xs" 
                        onPress={getBack} 
                        alignItems="flex-start" 
                        style={{paddingRight: 10}}
                        bg="$backgroundDark100"
                    >
                        <ButtonIcon as={ChevronLeftIcon} size="2xl" color="$black" />
                    </Button>
                    <Text 
                        style={{
                            fontWeight: "600", 
                            fontSize: 30, 
                            color: "black", 
                            paddingTop: 10, 
                            marginLeft: -5,
                            maxWidth: "40%"
                        }}
                    >
                        {username}
                    </Text>
                    <Button bg="$backgroundDark100" onPress={() => setShowAlertDialog(true)}>
                        <Avatar size="md" >
                            {avatar ? <></> : 
                                <AvatarFallbackText size="xl">{username}</AvatarFallbackText>}
                            <AvatarImage alt={alt} source={src} />
                        </Avatar>
                    </Button>
                    <Badge size="md" variant="solid" borderRadius="$none" bg="$backgroundDark100" style={{marginLeft: -15}}>
                        <BadgeIcon as={CircleIcon} ml="$2" color="$green600" />
                        <BadgeText style={{marginLeft: 5}} color="$green600" >online</BadgeText>
                    </Badge>
                    <Button bg="$backgroundDark100" style={{}} onPress={() => setShowAlertDialog(true)}>
                        <ButtonIcon as={MenuIcon} size="2xl" color="$black" />
                    </Button>
                    <AlertDialog
                        isOpen={showAlertDialog}
                        onClose={() => {
                        setShowAlertDialog(false)
                        }}
                    >
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                        <AlertDialogHeader borderBottomWidth="$0">
                            <HStack space="sm" alignItems="center">
                            <Icon
                                as={CheckCircleIcon}
                                color="$success700"
                                $dark-color="$success300"
                            />
                            <Heading size="lg">Prueba</Heading>
                            </HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Text size="sm">
                                Esta es una pantalla de prueba
                            </Text>
                        </AlertDialogBody>
                        <AlertDialogFooter borderTopWidth="$0">
                            <Button
                                variant="outline"
                                size="sm"
                                action="secondary"
                                mr="$3"
                                onPress={() => {
                                    setShowAlertDialog(false)
                                }}
                            >
                                <ButtonText>Okay</ButtonText>
                            </Button>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </HStack>
            </Box>
            {/*<KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1}}
            >*/}
                {/*<View style={styles.messageBox}>*/}
                    <Box style={styles.messageBox && {height: keyboardIsUp ? "45%" : "82%"}}>
                        {(messages.length > 0) ? (
                            <ScrollView>
                                {messages.map((message) => {
                                    return (
                                        <VStack space="xs" alignItems="flex-start" key={message.message_id} >
                                            {(message.sender_id === id) ? (
                                                
                                            <View 
                                                style={[
                                                    styles.rightTalkBubble, 
                                                    {width: measure(message.content), 
                                                    height: 80, marginBottom: -13 
                                                    }
                                                ]}
                                            >
                                                <View style={styles.rightTalkBubbleSquare}>
                                                    <Text onLayout={() => {}} style={styles.text}>{message.content}</Text>
                                                </View>
                                                <View style={styles.rightTalkBubbleTriangle} />
                                            </View>
                                            ) : (
                                            <View 
                                                style={[
                                                    styles.leftTalkBubble, 
                                                    {width: measure(message.content), 
                                                    height: 80 }
                                                ]}
                                            >
                                                <View style={styles.leftTalkBubbleSquare} >
                                                    <Text onLayout={() => {}} style={styles.text}>{message.text}</Text>
                                                </View>
                                                <View style={styles.leftTalkBubbleTriangle} />
                                            </View>)}
                                        </VStack>
                                    );
                                })}

                            </ScrollView>
                        ) : (
                            <Box style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{alignSelf: "center"}}>There are no messsages here!</Text>
                            </Box>
                        )}
                    </Box>
                {/*</SafeAreaView></View>
                <View style={styles.actionBox}>*/}
                    <Box style={{height: keyboardIsUp ? "55%" : "18%", backgroundColor: "rgba(55, 40, 160, 1)"}}>
                        <HStack style={{marginTop: 10}}>
                            <Button backgroundColor="transparent" style={{marginRight: -10}}>
                                <ButtonIcon as={GripVerticalIcon} size="2xl" color="white" />
                            </Button>
                            <View style={styles.inputBox}>
                                <Input size="md" variant="rounded" borderColor="transparent">
                                    <InputField 
                                        placeholder= {placeholderIsSelected ? "" : "Enter text here..."} 
                                        placeholderTextColor="white" 
                                        onFocus={() => {
                                            setPlaceholderIsSelected(true);
                                            setKeyboardIsUp(true)
                                        }} 
                                        onBlur={() => {
                                            setPlaceholderIsSelected(false);
                                            setKeyboardIsUp(false);
                                        }} 
                                        color="white"
                                    />
                                </Input>
                            </View>
                            {/*<KeyboardAvoidingView
                                style={styles.container}
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                keyboardVerticalOffset={Platform.select({ios: 0, android: 50})}
                            >
                                <View style={styles.innerContainer}>
                                    <TextInput
                                        style={styles.input}
                                        //value={inputValue}
                                        placeholder = {placeholderIsSelected ? '' : "Enter text here..."}
                                        onFocus = {() => setPlaceholderIsSelected(true)}
                                        onBlur={() => setPlaceholderIsSelected(false)}
                                        color='white'
                                    />
                                </View>
                            </KeyboardAvoidingView>*/}
                            <Button backgroundColor="transparent" >
                                <Camera color="white" size={30} strokeWidth={1.5}/>
                            </Button>
                            <Button backgroundColor="transparent" style={{paddingLeft: 5}}>
                                <Zap color="white" size={30} strokeWidth={1.5} />
                            </Button>

                        </HStack>
                    </Box>
                {/*</View>*/}
            {/*</KeyboardAvoidingView>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rightTalkBubble: {
        backgroundColor: "transparent",
        alignSelf: "flex-end",
        marginRight: 30,
        marginBottom: -35,
    },
    rightTalkBubbleSquare: {
        backgroundColor: "rgba(0,0,0,.5)",
        borderRadius: 20,
        borderTopRightRadius: 0,
        padding: 10,
    },
    text: {
        color: "white"
    },
    rightTalkBubbleTriangle: {
        alignSelf: "flex-end",
        position: "relative",
        left: 10,
        top: -64,
        width: 0,
        height: 0,
        borderTopColor: "transparent",
        borderTopWidth: 0,
        borderRightWidth: 10,
        borderRightColor: "rgba(0,0,0,.5)",
        borderBottomWidth: 10,
        borderBottomColor: "transparent",
        transform: [{ rotate: "-90deg" }]
    },
    leftTalkBubble: {
        backgroundColor: "transparent",
        marginLeft: 30,
        marginBottom: -35,
    },
    leftTalkBubbleSquare: {
        backgroundColor: "rgba(79, 70, 245, .8)",
        borderRadius: 20,
        borderTopLeftRadius: 0,
        padding: 10,
    },
    leftTalkBubbleTriangle: {
        position: "absolute",
        left: -10,
        top: 0,
        width: 0,
        height: 0,
        borderTopColor: "transparent",
        borderTopWidth: 0,
        borderRightWidth: 10,
        borderRightColor: "rgba(79, 70, 245, .8)",
        borderBottomWidth: 10,
        borderBottomColor: "transparent",
    },
    headingBox: {
        marginBottom: 10,
        marginTop: Platform.OS === 'android' && 25
    },
    messageBox: {
        verticalAlign: "top",
    },
    actionBox: {
        backgroundColor: "rgba(55, 40, 160, 1)",
    },
    inputBox: {
        width: "55%", 
        backgroundColor: "rgba(109, 105, 255, .9)",
        borderRadius: 20,
    }
});

export default Messaging;