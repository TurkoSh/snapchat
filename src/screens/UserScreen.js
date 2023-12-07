import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../authManager/AuthContext';

const UserScreen = ({ navigation }) => {
    const { logout, user, isAuthenticated } = useContext(AuthContext);
    const [snaps, setSnaps] = useState([]);

    useEffect(() => {
        fetchSnaps();
    }, []);

    const getUserById = (_id) => {
        fetch(`https://mysnapchat.epidoc.eu/user/${_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user?.data?.token}`,
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(data => {
            return data.data;
        }).catch(error => {
            console.log('Error updating user:', error);
        });
    };

    const fetchSnaps = async () => {
        try {
            const response = await fetch('https://mysnapchat.epidoc.eu/snap', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user?.data?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            let data = await response.json();

            const userData = getUserById(data.data[0].from);

            // console.log(userData);
            // data.data[0].push(userData);

            setSnaps(data.data);
        } catch (error) {
            console.log('Error fetching snaps:', error);
        }
    };


    const getSnapById = async (id) => {
        try {
            const response = await fetch(`https://mysnapchat.epidoc.eu/snap/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user?.data?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const snap = await response.json();
            navigation.navigate('SnapScreen', {
                snapImageUrl: snap.data.image,
                _id: snap.data._id,
                date: snap.data.date,
                duration: snap.data.duration,
                from: snap.data.from
            });
        } catch (error) {
            console.log('Error fetching snap by id:', error);
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={snaps}
                keyExtractor={snap => snap._id.toString()}
                renderItem={({ item: snap }) => (
                    <TouchableOpacity onPress={() => getSnapById(snap._id)}>
                        <View style={styles.item}>
                            <Text style={styles.title}>{snap.from}</Text>
                            <Text style={styles.subtitle}>{snap.date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 30,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    subtitle: {
        fontSize: 24,
    },
});

export default UserScreen;