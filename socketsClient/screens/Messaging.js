import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
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
    AlertDialogFooter
} from "@gluestack-ui/themed";
import { ChevronLeftIcon, CircleIcon, MenuIcon, CheckCircleIcon } from "@gluestack-ui/themed";


const messages = [
    {
        user: "Yael",
        messages: [
            "Qué onda weee, qué pedo!",
            "Hola soy Yaelooo",
            "Xdxdxdxd",
        ],
        hour: "10:35:47",
        date: "22/1/24",
    },
    {
        user: "Luki",
        messages: [
            "Hola soy Lukiii",
            "Holaholaholahola",
            "Xdddddddddddd",
        ],
        hour: "14:07:06",
        date: "22/1/24",
    }
]

const Messaging = ({ route, navigation }) => {
    const { usr, st, avtr } = route.params;
    const username = JSON.stringify(usr).replace(/^"(.*)"$/, '$1');
    const state = JSON.stringify(st).replace(/^"(.*)"$/, '$1');
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

    const aLength = 7.8125;

    useLayoutEffect(() => {
        if (state.length <= 32) {
            newWidth = state.length * aLength + 10;
            newHeight = bubbleDimensions.height;
            setBubbleDimensions({ width: newWidth, height: newHeight});
            console.log("State Length: ", state.length);
            console.log('Text Width:', newWidth);
            console.log('Text Height:', newHeight);
        }
    }, [state]);

    return (
        <SafeAreaView>
            <Box>
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
            <Box>
                <View style={[styles.talkBubble, {width: bubbleDimensions.width, height: bubbleDimensions.height }]}>
                    <View style={styles.talkBubbleSquare} >
                        <Text onLayout={() => {}} style={styles.text}>{state}</Text>

                    </View>
                    <View style={styles.talkBubbleTriangle} />
                </View>
            </Box>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    talkBubble: {
        backgroundColor: "transparent",
        marginLeft: 30,
        marginTop: 20,
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
});

export default Messaging;