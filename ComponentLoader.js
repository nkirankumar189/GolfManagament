import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { AppColors } from '../Utils/Constants';

const ComponentLoader = ({ size = 'large', color = AppColors.defaultColor, style }) => {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export default ComponentLoader;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});