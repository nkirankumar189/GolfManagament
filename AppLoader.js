import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';
import { AppColors } from '../Utils/Constants';
import { useSelector } from 'react-redux';

const AppLoader = ({
    visible = false,
    size = 'large',
    color = AppColors.defaultColor,
    overlayColor = 'rgba(0, 0, 0, 0.3)',
    text = "Loading...",
    textStyle = { color: AppColors.defaultColor },
    indicatorStyle
}) => {
    const { isLoading, loadingText } = useSelector((state) => state.loader);
    return (
        <Modal transparent visible={isLoading}>
            <View style={[styles.container, { backgroundColor: overlayColor }]}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size={size}
                        color={color}
                        style={indicatorStyle}
                    />
                    {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },
});

export default AppLoader;