import React, { useRef, useContext, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { View, Image, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { AuthContext } from '../authManager/AuthContext';
import { Audio } from 'expo-av';

export default HomeScreen = ({ navigation }) => {

    const { user } = useContext(AuthContext);

    const [rotation, setRotation] = useState(false);
    const [renderCount, setRenderCount] = useState(1);

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const handleRegisterPress = () => {
        navigation.navigate('SignUp');
    };

    const handleRotationPress = () => {
        setRotation(rotation ? false : true);

    };

    const generateColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');


        if (renderCount < 10) {
            return `#fff`;
        };

        return `#${randomColor}`;
    };

    const generatePosX = () => {
        return Math.floor() * 200 + 1;
    };

    const generatePosY = () => {
        return Math.floor() * 250 + 1;
    };

    const opacityValue = useRef(new Animated.Value(0.7)).current;
    const animateLogoOverlay = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityValue, {
                    toValue: 0.9,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 0.7,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]),
            {
                iterations: -1,
            }
        ).start();
    };
    useEffect(() => {
        animateLogoOverlay();
    }, []);

    const spinValue = useRef(new Animated.Value(0)).current;

    let spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const animateRotation = () => {
        const randomSpeed = Math.random() * 3 + 0.1;

        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        Animated.timing(spinValue, {
            toValue: randomSpeed,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();

        return spin;
    };

    return (
        <View style={styles.pageContainer} >
            <View style={styles.container}>
                <View style={styles.logoContainer} >
                    <Animated.Image
                        source={require('../assets/images/snapchat_overlay.png')}
                        style={[styles.logo_overlay,
                        {
                            tintColor: generateColor(),
                            opacity: opacityValue,
                            transform: [
                                {
                                    rotate: renderCount > 1 ? animateRotation() : "0deg"
                                },
                                // {
                                //     translateX: renderCount > 20 ? generatePosX() : 1,
                                // },
                                // {
                                //     translateY: renderCount > 20 ? generatePosY() : 1,
                                // }
                            ]
                        }]}
                    />

                    <TouchableWithoutFeedback onPress={async () => {
                        const count = renderCount;
                        setRenderCount(1 + count);
                        // console.log(count);
                        handleRotationPress();

                        if (renderCount === 10) {
                            const soundObject = new Audio.Sound();
                            await soundObject.loadAsync(require('../assets/audio/welcome_to_my_snapchat.wav'));
                            await soundObject.playAsync();
                        };
                    }}>
                        <Image
                            source={require('../assets/images/snapchat_logo.png')}
                            style={styles.logo}
                        />
                    </TouchableWithoutFeedback>

                </View>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableHighlight
                    style={[styles.buttonContainer, { backgroundColor: '#FF4081' }]}
                    onPress={handleLoginPress}
                >

                    {user?.data?.username ? (
                        <>
                            <Text style={styles.buttonText}>LOGIN AS</Text>
                            <Text style={styles.buttonText}>
                                {user.data.username.toUpperCase()}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.buttonText}>LOGIN</Text>
                    )}
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.buttonContainerBlue, { backgroundColor: '#3F51B5' }]}
                    onPress={handleRegisterPress}
                >
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: 'yellow',
        padding: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 0,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: "100%",
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },
    logo_overlay: {
        width: 250,
        height: 400,
        position: 'absolute',
        top: -160,
        opacity: 0.9,

        shadowColor: 'black',
        shadowOffset: { width: 5, height: 2 },
        shadowOpacity: 1,
    },
    buttonsContainer: {
        justifyContent: "flex-end",
        marginBottom: -25,
        marginLeft: -50,
        marginRight: -50,
    },
    buttonContainer: {
        width: '100%',
        paddingLeft: '40%',
        paddingRight: '40%',
        paddingVertical: 30,
        marginBottom: 80,
        alignItems: 'center',
    },
    buttonContainerBlue: {
        position: "absolute",
        width: '100%',
        paddingLeft: '40%',
        paddingRight: '40%',
        paddingVertical: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});