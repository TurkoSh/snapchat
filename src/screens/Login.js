import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Linking, ActivityIndicator } from 'react-native';
import { AuthContext } from '../authManager/AuthContext';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { user, login, logout } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(user ? true : false);

    useEffect(() => {
        if (user) {
            fetch(`https://mysnapchat.epidoc.eu/user/${user.data._id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user?.data?.token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data?.data?.username) {
                        navigation.navigate('MainPage');
                    } else {
                        logout();
                        navigation.navigate('SignUp');
                    }
                })
                .catch(error => {
                    console.log('Error sending snap:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user, navigation]);

    const handleLogin = () => {
        if (email && password) {
            loginUser();
        } else {
            setErrorMessage('Please fill in all the mandatory fields');
            console.log('Please fill in all the mandatory fields');
        };
    };

    const loginUser = () => {
        const user = { email, password };

        fetch('https://mysnapchat.epidoc.eu/user', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if (!response.ok) throw new Error('An error occurred during login');
            return response.json();
        }).then((data) => {
            login(data);
            console.log('Login successful');
            // console.log(data);
            navigation.navigate('MainPage');
        }).catch((error) => {
            setErrorMessage('An error occurred during login, please check your credentials baka!');
            console.log('An error occurred during login:', error);
        });
    };

    const validateForm = () => {
        setIsFormValid(email !== '' && password !== '');
    };

    const handleTermsOfServicePress = () => {
        Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <>
                    {errorMessage ? (
                        <Text style={styles.error}>{errorMessage}</Text>
                    ) : null}
                    <Text style={styles.heading}>Welcome back!</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={text => {
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
                            onChangeText={text => {
                                setPassword(text);
                                validateForm();
                            }}
                            onBlur={validateForm}
                            secureTextEntry
                        />
                    </View>
                    <Text style={styles.disclaimer}>
                        By pressing the "
                        <Text style={{ color: 'blue' }}>LOGIN AND ACCEPT</Text>
                        " button, you acknowledge that the totality of your money will go towards Amin's personal Livret A account, oh and you accept the{'\n'}
                        <Text style={styles.link} onPress={handleTermsOfServicePress}>
                            terms of service.
                        </Text>
                    </Text>
                    <Pressable
                        onPress={handleLogin}
                        disabled={!isFormValid}
                        style={({ disabled }) => [
                            styles.button,
                            { backgroundColor: !isFormValid ? '#888' : '#00aeff' },
                        ]}
                    >
                        <Text style={styles.buttonText}>LOGIN AND ACCEPT</Text>
                    </Pressable>
                </>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default Login;
