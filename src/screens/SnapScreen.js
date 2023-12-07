import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../authManager/AuthContext';

const SnapScreen = ({ navigation, route }) => {


  const { logout, user, login, isAuthenticated } = useContext(AuthContext);

  const {
    snapImageUrl,
    _id,
    date,
    duration,
    from,
  } = route.params;


  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [showSnap, setShowSnap] = useState(true);
  const [users] = useState();

  // useEffect(() => {

  //   if (!user) return navigation.navigate("Home");
  //   if (!_id) return navigation.navigate("UserScreen");

  //   if (timeRemaining > 0) {
  //     const timer = setTimeout(() => {
  //       setTimeRemaining(timeRemaining - 1);
  //     }, duration * 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setShowSnap(false);
  //   }
  // }, [timeRemaining]);

  return (
    <View style={styles.container}>
      {showSnap && (
        <>
          <Text>User</Text>
          <Image
            style={styles.image}
            source={{ uri: `${snapImageUrl}` }}
            // source={require('../assets/app_icon/snapchat_icon_512_512.png')}
          />
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
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SnapScreen;
