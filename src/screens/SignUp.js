import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Linking } from 'react-native';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = () => {
        if (email && password && username) {
            registerUser();
        } else {
            console.log('Please fill in all the mandatory fields');
        };
    };

    const registerUser = () => {
        const user = { email, username, profilePicture: '', password };

        fetch('https://mysnapchat.epidoc.eu/user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('An error occurred during sign up');
            };
            return response.json();
        }).then((data) => {
            console.log(data);
            console.log('Sign up successful');
            navigation.navigate('Login');
        }).catch((error) => {
            setErrorMessage(error.message);
            console.log('An error occurred during sign up:', error);
        });
    };

    const validateForm = () => {
        setIsFormValid(email !== '' && password !== '' && username !== '');
    };

    const handleTermsOfServicePress = () => {
        Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    };

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
            <Text style={styles.heading}>Welcome to my_snapchat!</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    onChangeText={(text) => {
                        setEmail(text);
                        validateForm();
                    }}
                    onBlur={validateForm}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    onChangeText={(text) => {
                        setPassword(text);
                        validateForm();
                    }}
                    onBlur={validateForm}
                    secureTextEntry
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    onChangeText={(text) => {
                        setUsername(text);
                        validateForm();
                    }}
                    onBlur={validateForm}
                />
            </View>
            <Text style={styles.disclaimer}>
                By pressing the "
                <Text style={{ color: 'blue' }}>SIGNUP AND ACCEPT</Text>
                " button, you acknowledge that the totality of your money will go towards Amin's personal Livret A account, oh and you accept the{'\n'}
                <Text style={styles.link} onPress={handleTermsOfServicePress}>
                    terms of service.
                </Text>
            </Text>
            <Pressable
                onPress={handleSignUp}
                disabled={!isFormValid}
                style={({ disabled }) => [
                    styles.button,
                    { backgroundColor: !isFormValid ? '#888' : '#00aeff' },
                ]}
            >
                <Text style={styles.buttonText}>SIGN UP AND ACCEPT</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        marginTop: 16,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    label: {
        marginBottom: 4,
        fontSize: 12,
        color: '#999',
    },
    disclaimer: {
        fontSize: 10,
        marginBottom: 24,
        textAlign: 'center',
        color: '#777',
    },
    link: {
        fontWeight: 'bold',
        color: 'blue',
        textDecorationLine: 'underline',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
});

export default SignUp;
