import React, { useState, useEffect, useRef, useContext } from 'react';
import { Camera } from 'expo-camera';
import {
    View, StyleSheet, TouchableOpacity,
    TouchableHighlight, TextInput, Text, Image,
    Modal, FlatList, TouchableWithoutFeedback,
    Pressable, KeyboardAvoidingView, SafeAreaView,
    ScrollView, Alert, Button
} from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { AuthContext } from '../authManager/AuthContext';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const MainPage = ({ navigation }) => {

    const { logout, user, login, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) navigation.navigate('Home');

    // CAMERA 
    const [hasPermission, setHasPermission] = useState(null); // 
    const [type, setType] = useState(Camera.Constants.Type.back); //
    const cameraRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    // * * * 

    const [users, setUsers] = useState([]);
    const [duration, setDuration] = useState(5); // Durée snap

    // MODAL
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // TODO
    const [isSendButtonVisible, setIsSendButtonVisible] = useState(false); //
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);


    const [email, setEmail] = useState(`${user?.data?.email}` ?? "null");
    const [username, setUsername] = useState(`${user?.data?.username}` ?? "null");
    const [newPassword, setNewPassword] = useState('');
    const [pfp, setPfp] = useState(user?.data?.profilePicture ?? "null");
    // * * *

    useEffect(() => {
        if (photo) {
            console.log('Photo captured:', photo);
        };
    }, [photo]);


    useEffect(() => {
        (async () => {
            // console.log("Asking perms...");
            await MediaLibrary.requestPermissionsAsync();
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            getUsers();
        })();
    }, []);

    const getUsers = async () => {
        if (!user) return navigation.navigate('Home');

        try {
            const response = await fetch('https://mysnapchat.epidoc.eu/user', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${user?.data?.token}`
                }
            });

            const data = await response.json();
            setUsers(data.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        };
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if (result && result.assets !== null) {
            setPhoto(result.assets[0]);
            setIsModalVisible(true);
        };
    };

    const pickImageUserSettings = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if (result && result.assets !== null) {
            console.log(result);
            setPfp(result.assets[0].uri);
        };
    };

    const handleDoubleTap = ({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            setType(
                type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
            );
        };
    };

    const handleCapturePhoto = async () => {
        // console.log("Cheese!");
        if (cameraRef.current) {
            // console.log("Cheese 2!");
            try {
                const takenPhoto = await cameraRef.current.takePictureAsync();
                setPhoto(takenPhoto);
                const asset = await MediaLibrary.createAssetAsync(takenPhoto.uri);
                const album = await MediaLibrary.getAlbumAsync('my_snapchat');

                if (album === null) {
                    await MediaLibrary.createAlbumAsync('my_snapchat', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                };
                console.log('Photo saved to gallery');
                setIsModalVisible(true);
            } catch (error) {
                console.log('Error saving photo to gallery', error);
            };
        };
    };

    const handleDisconnect = () => {
        logout();
        navigation.navigate('Home');
    };

    const deleteButtonAlert = () =>
        Alert.alert('Are you sure you want to delete?', "If you're sure you want to delete your user, press \"OK\".", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteUser() },
        ]);

    const createButtonAlert = () =>
        Alert.alert('This form is uncompleted.', 'Please complete all inputs of the form before updating', [
            { text: 'Understood', },
        ]);

    const updateUser = async () => {
        if (!user) return navigation.navigate('Home');

        if (!email || !username || !newPassword) return createButtonAlert();

        let base64Image = "";
        if (pfp) {
            const imageFile = await FileSystem.readAsStringAsync(pfp, {
                encoding: FileSystem.EncodingType.Base64,
            });
            base64Image = `data:image/png;base64,${imageFile}`;
        };

        const requestData = {
            email: email,
            username: username,
            profilePicture: base64Image,
            password: newPassword
        };

        fetch('https://mysnapchat.epidoc.eu/user', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user?.data?.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        }).then(response => response.json()).then(data => {
            console.log('User updated successfully:', data);
            console.log(data);
            setNewPassword(null);
            setIsProfileModalVisible(false);
        }).catch(error => {
            console.log('Error updating user:', error);
        });
    };

    const deleteUser = () => {
        if (!user) return navigation.navigate('Home');
        fetch('https://mysnapchat.epidoc.eu/user', {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${user?.data?.token}`,
            },
        }).then(response => response.json()).then(data => {
            console.log('User deleted successfully:', data);
            navigation.navigate('Home');
            handleDisconnect();
        }).catch(error => {
            console.log('Error deleting user:', error);
        });
    };

    const renderUserItem = ({ item }) => { // Component users list
        const isSelected = item._id === selectedUser?._id;
        return (
            <TouchableOpacity
                style={[
                    styles.userItem,
                    isSelected && { backgroundColor: '#e0e0e0' },
                ]}
                onPress={() => setSelectedUser(item)}
            >
                {item.profilePicture ? (
                    <Image style={styles.profilePicture} source={{ uri: item.profilePicture }} />
                ) : (
                    <Image style={styles.profilePicture} source={require('../assets/images/default_icon.png')} />
                )}
                <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <TapGestureHandler onHandlerStateChange={handleDoubleTap} numberOfTaps={2}>
            <View style={styles.container}>
                <Camera ratio="20:9" style={styles.camera} type={type} ref={cameraRef} />

                <TouchableOpacity style={styles.button} onPress={async () => {

                    await handleCapturePhoto();

                    if (photo) {
                        setIsModalVisible(true);
                    };
                }} />

                <TouchableOpacity style={styles.containerUserScreen} onPress={() => navigation.navigate('UserScreen')}>
                    <Image style={styles.UserScreen} source={require('../assets/images/Snaps.png')} />
                </TouchableOpacity>


                <TouchableOpacity style={styles.profileIconContainer} onPress={() => setIsProfileModalVisible(true)} >
                    <Image style={styles.profileIcon} source={require('../assets/images/gear_icon.png')} />
                </TouchableOpacity>

                <Modal visible={isProfileModalVisible} animationType="slide">

                    <TouchableOpacity style={styles.pfpContainer} onPress={pickImageUserSettings}>
                        {user && pfp ? (
                            <Image style={styles.LoggedUserprofilePicture} source={{ uri: pfp }} />
                        ) : (
                            <Image style={styles.LoggedUserprofilePicture} source={require('../assets/images/default_icon.png')} />
                        )}
                        {/* <Text style={{ top: 180, fontWeight: 600, fontSize: 24 }}>{user?.data?.email ?? "Unknown"}</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsProfileModalVisible(false)} >
                        <Image style={styles.closeIcon} source={require('../assets/images/close_icon.png')} />
                    </TouchableOpacity>

                    <View style={styles.profileModalContainer}>

                        <View style={styles.inputsContainer}>
                            <Text>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                            />

                            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={30}>
                                <Text>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                />
                            </KeyboardAvoidingView>

                            <TouchableOpacity style={styles.sendButton} onPress={updateUser} >
                                <Text style={styles.sendButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <SafeAreaView>
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteButtonAlert}>
                            <Text style={styles.deleteButtonText}>Delete Profile</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>

                <TouchableOpacity style={styles.containerDisconnectButton} onPress={handleDisconnect}>
                    <Image style={styles.disconnectButton} source={require('../assets/images/disconnect_icon.png')} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.containerOpenGallery} onPress={pickImage}>
                    <Image style={styles.openGallery} source={require('../assets/images/open_gallery.png')} />
                </TouchableOpacity>

                <Modal visible={isModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Users</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Image style={styles.closeIcon} source={require('../assets/images/close_icon.png')} />
                            </TouchableOpacity>
                        </View>
                        <FlatList data={users} renderItem={renderUserItem} keyExtractor={(item) => item._id} />

                        {selectedUser && (
                            <View>
                                <TouchableOpacity
                                    style={styles.sendButton}
                                    onPress={async () => {
                                        const imageFile = await FileSystem.readAsStringAsync(photo.uri, {
                                            encoding: FileSystem.EncodingType.Base64,
                                        });
                                        const base64Image = `data:image/png;base64,${imageFile}`;
                                        const requestData = {
                                            to: selectedUser._id,
                                            image: base64Image,
                                            duration: parseInt(duration) === isNaN ? 5 : parseInt(duration),
                                        };

                                        fetch('https://mysnapchat.epidoc.eu/snap', {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': `Bearer ${user?.data?.token}`,
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(requestData),
                                        }).then(response => response.json()).then(data => {
                                            console.log('Snap sent successfully:', data);
                                            setSelectedUser(null);
                                            setIsModalVisible(false);
                                        }).catch(error => {
                                            console.log('Error sending snap:', error);
                                        });
                                    }} >
                                    <Text style={styles.sendButtonText}>Send</Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.durationInput}
                                    value={duration.toString()}
                                    onChangeText={text => setDuration(text)}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}
                    </View>
                </Modal>
            </View >
        </TapGestureHandler >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: "100%"
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderStyle: 'solid',
        borderWidth: 5,
        borderColor: 'white',
        position: 'absolute',
        bottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerDisconnectButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    disconnectButton: {
        tintColor: 'white',
        height: 50,
        width: 50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profilePicture: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    username: {
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
        alignSelf: 'center',
    },
    sendButtonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    durationInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        marginTop: 16,
    },
    profileIconContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 2,
    },
    profileIcon: {
        tintColor: "white",
        height: 44,
        width: 44,
    },
    profileModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    LoggedUserprofilePicture: {
        position: "absolute",
        height: 150,
        width: 150,
        borderRadius: 100,
        marginBottom: 16,
        top: 50
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    closeIcon: {
        tintColor: "black",
        height: 20,
        width: 20,
        // top: 40
    },
    deleteButton: {
        position: "absolute",
        backgroundColor: 'red',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
        bottom: 40,
        alignSelf: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    containerOpenGallery: {
        position: 'absolute',
        bottom: 33,
        left: 20,
        zIndex: 2,
    },
    openGallery: {
        tintColor: "white",
        height: 44,
        width: 44,
    },
    inputsContainer: {
        flex: 0,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    input: {
        width: 200,
        maxWidth: 200,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    hidden: {
        position: "absolute",
        display: "none"
    },
    pfpContainer: {
        flex: 1,
        maxHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerUserScreen: {
        position: 'absolute',
        bottom: 33,
        right: 20,
        zIndex: 2,
    },

    UserScreen: {
        tintColor: "white",
        width: 50,
        height: 50,
    },
});

export default MainPage;