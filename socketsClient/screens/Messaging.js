import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
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
import { ChevronLeftIcon, CircleIcon, MenuIcon, CheckCircleIcon, GripVerticalIcon} from "@gluestack-ui/themed";
import { Camera, Zap } from "lucide-react-native";

/*
const myMessages= [
    {
        text: "ME LA PONES COMO PATA DE PERRO",
        date: new Date(2024, 0, 27, 12, 31, 5, null).toLocaleString(),
        user: "César"
    },
    {
        text: "JE JE JE JE BIEN CHUECOTA TE PARTO EL EJE",
        date: new Date(2024, 0, 27, 12, 31, 59, null).toLocaleString(),
        user: "César",
    }
]*/

const sqlData = [];


const Messaging = ({ route, navigation }) => {
    const[id, setId] = useState("");
    const { usr, st, avtr } = route.params;
    const username = JSON.stringify(usr).replace(/^"(.*)"$/, '$1');
    const [messages, setMessages] = useState([]);
    // We don't neet the state param anymore.
    const ste = JSON.stringify(st);
    const state = JSON.parse(ste);

    const avatar = JSON.stringify(avtr).replace(/^"(.*)"$/, '$1');
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const textRef = useRef(null);
    const [combinedArray, setCombinedArray] = useState([]);
    const [placeholderIsSelected, setPlaceholderIsSelected] = useState(false);

    const [bubbleDimensions, setBubbleDimensions] = useState({
        width: 250,
        height: 80,
    });

    const getBack = () => {
        navigation.navigate("Chat");
    }

    let alt = "\"" + username + "\"" + " Avatar";
    let src = { 
        ["uri"]: avatar, 
    };

    const aLowercaseLength = 20; // 19 w's

    const getId = async () => {
        try {
          const value = await AsyncStorage.getItem("id");
          if (value !== null) {
            setId(value);
            socket.emit("identify", id);
            socket.emit("requestUsers", false, value);
          }
        } catch (e) {
          console.error(e);
        }
      };
    

    useLayoutEffect(() => {
        state.forEach(message => {
            if (message.text.length <= 32) {
                const resultWidth = message.text.length * aLowercaseLength + 30;
                const newWidth = resultWidth <= 250 ? resultWidth : 250;
                const newHeight = bubbleDimensions.height;
                //setBubbleDimensions({ width: newWidth, height: newHeight });
            }
        });
    }, []);

    useEffect(() => {
        getId();
        socket.emit("deployMessages", id);
        socket.off("deployMessages").on("deployMessages", (response) => {
            if (response.length == 0) {
                // Here it's supposed to deploy a text saying there're no messages.
            } else {
                let i = 0;
                response.forEach(message => {
                    sqlData.forEach(m => {
                        if (message.message_id != m.message_id) {
                            sqlData.push(
                                response[i].message_id,
                                response[i].sender_id,
                                response[i].recipient_id,
                                response[i].postDate,
                                response[i].content
                                );
                            i++;
                        }
                    })
                });
            }
        })
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
                            marginLeft: -5
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
                            <Heading size="lg">Sexooooooooo</Heading>
                            </HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Text size="sm">
                                Yael y Luk putoooooosss
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
            <Box style={styles.messageBox}>
                {(combinedArray.length > 0) ? (
                    <ScrollView>
                        {combinedArray.map((message) => {
                            return (
                                <VStack space="xs" alignItems="flex-start" key={message.date} >
                                    {(message.user === "César") ? (
                                        
                                    <View style={[styles.rightTalkBubble, {width: bubbleDimensions.width, height: bubbleDimensions.height, marginBottom: -13 }]}>
                                        <View style={styles.rightTalkBubbleSquare}>
                                            <Text onLayout={() => {}} style={styles.text}>{message.text}</Text>
                                        </View>
                                        <View style={styles.rightTalkBubbleTriangle} />
                                    </View>
                                    ) : (
                                    <View style={[styles.leftTalkBubble, {width: bubbleDimensions.width, height: bubbleDimensions.height }]}>
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
                    <Text>Click the icon to start a new Chat!</Text>
                )}
            </Box>
            <Box style={styles.actionBox}>
                <HStack style={{marginTop: 10}}>
                    <Button backgroundColor="transparent" style={{marginRight: -10}}>
                        <ButtonIcon as={GripVerticalIcon} size="2xl" color="white" />
                    </Button>
                    <View style={styles.inputBox}>
                        <Input size="md" variant="rounded" borderColor="transparent">
                            <InputField 
                                placeholder= {placeholderIsSelected ? "" : "Enter text here..."} 
                                placeholderTextColor="white" 
                                onFocus={() => setPlaceholderIsSelected(true)} 
                                onBlur={() => setPlaceholderIsSelected(false)} 
                                color="white"
                            />
                        </Input>
                    </View>
                    <Button backgroundColor="transparent" >
                        <Camera color="white" size={30} strokeWidth={1.5}/>
                    </Button>
                    <Button backgroundColor="transparent" style={{paddingLeft: 5}}>
                        <Zap color="white" size={30} strokeWidth={1.5} />
                    </Button>

                </HStack>
            </Box>
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
    },
    messageBox: {
        minHeight: "78%",
        maxHeight: "78%",
        verticalAlign: "top"
    },
    actionBox: {
        height: "22%",
        backgroundColor: "rgba(55, 40, 160, 1)",
    },
    inputBox: {
        width: "55%",
        backgroundColor: "rgba(109, 105, 255, .9)",
        borderRadius: 20,
    },
});

export default Messaging;