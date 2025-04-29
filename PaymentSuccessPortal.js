import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { AppColors, DeviceDimentions } from '../Utils/Constants';
import CustomImage from './CustomImage';
import { IMAGES } from '../assets/images/images';

const PaymentSuccessPortal = ({ visible, onClose }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 8, stiffness: 150 });
        } else {
            scale.value = 0;
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (!visible) return null;

    return (
        <Portal>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.outerContainer}>

                <Animated.View style={[styles.modalView, animatedStyle]}>
                    <CustomImage
                        source={IMAGES.logo_blue}
                        placeholderSource={IMAGES.logo_blue}
                        style={styles.image}
                        resizeMode="cover"
                        showLoadingIndicator={true}
                    />
                    <Text style={styles.successText}>✅ Payment Successful</Text>
                </Animated.View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: AppColors.white,
        borderRadius: 12,
        padding: moderateScale(30),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: DeviceDimentions.width - moderateScale(100),
        alignItems: 'center',
    },
    successText: {
        fontWeight: '700',
        fontSize: moderateScale(20),
        color: 'green',
        textAlign: 'center',
    },
    image: {
        width: moderateScale(110),
        height: moderateScale(110),
        borderRadius: 16,
        marginBottom: moderateScale(15)
    },
});

export default PaymentSuccessPortal;
