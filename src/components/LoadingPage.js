import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const LoadingPage = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return (
            <View style={{
                flex: 1, position: "absolute", justifyContent: 'center', zIndex: 2, alignItems: 'center'
            }}>
                <ActivityIndicator size="large" />
            </View >
        );
    }

    return null;
};

export default LoadingPage;
