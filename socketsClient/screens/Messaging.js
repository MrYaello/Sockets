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


const Messaging = ({ route, navigation }) => {
    const { usr, st, avtr } = route.params;
    const username = JSON.stringify(usr).replace(/^"(.*)"$/, '$1');
    const ste = JSON.stringify(st);
    const state = JSON.parse(ste);
    const avatar = JSON.stringify(avtr).replace(/^"(.*)"$/, '$1');
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const textRef = useRef(null);

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

    return (
        <SafeAreaView>
            <Box style={styles.headingBox}>
                <HStack style={{alignItems: "center", paddingTop: 10,}} >
                    <Button 
                        size="xs" 
                        onPress={getBack} 
                        alignItems="flex-start" 
                        style={{paddingRight: 10}}
                        bg="$backgroundDark100"
                    >
                        <ButtonIcon as={ChevronLeftIcon} size="2xl" color="$black" />
                    </Button>
                    <Text style={{fontWeight: "600", fontSize: 30, color: "black", paddingTop: 10, marginLeft: -5}}>{username}</Text>
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
                    <Button bg="$backgroundDark100" style={{marginLeft: 100}} onPress={() => setShowAlertDialog(true)}>
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
                {(state.length > 0) ? (
                    <ScrollView>
                        {state.map((message) => {
                            return (
                                <VStack space="xs" alignItems="flex-start" key={message.date} >
                                    <View style={[styles.talkBubble, {width: bubbleDimensions.width, height: bubbleDimensions.height }]}>
                                        <View style={styles.talkBubbleSquare} >
                                            <Text onLayout={() => {}} style={styles.text}>{message.text}</Text>
                                        </View>
                                        <View style={styles.talkBubbleTriangle} />
                                    </View>
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
                            <InputField placeholder="Enter text here..." placeholderTextColor="white" />
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
    talkBubble: {
        backgroundColor: "transparent",
        marginLeft: 30,
        marginBottom: -35,
    },
    talkBubbleSquare: {
        backgroundColor: "rgba(79, 70, 245, .8)",
        borderRadius: 20,
        borderTopLeftRadius: 0,
        padding: 10,
    },
    text: {
        color: "white"
    },
    talkBubbleTriangle: {
        position: "absolute",
        left: -12,
        top: 0,
        width: 0,
        height: 0,
        borderTopColor: "transparent",
        borderTopWidth: 0,
        borderRightWidth: 12,
        borderRightColor: "rgba(79, 70, 245, .8)",
        borderBottomWidth: 12,
        borderBottomColor: "transparent",
    },
    headingBox: {
        marginBottom: 20
    },
    messageBox: {
        minHeight: "78%",
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