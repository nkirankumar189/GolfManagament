import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { IMAGES } from '../../../assets/images/images';
import CustomButton from '../../../Components/CustomButton';
import { AppColors } from '../../../Utils/Constants';


const WelcomePage = React.memo(() => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image source={IMAGES.logo_big} style={styles.logo} />
            <Text style={styles.subtitle}>Welcome to</Text>
            <Text style={styles.subtitle}>ProV Networking!</Text>

            <CustomButton
                title={'Let’s Get Started'}
                onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1, // Replace the second screen in the stack
                            routes: [
                                { name: 'LoginPage' }
                            ],
                        })
                    );
                }}
                backgroundColor={"#2E3192"}
                containerStyle={styles.button}
                color={"#fff"}
            />
        </View>
    );
});

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        bottom: moderateScale(10),
        width: scale(188),
        height: scale(178),
    },
    title: {
        color: '#FFFFFF',
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(10),
    },
    subtitle: {
        color: "#2E3192",
        fontWeight: '700',
        fontSize: moderateScale(20),
        lineHeight: moderateScale(20 * 1.4),
        letterSpacing: moderateScale(20 * 0.05),
        textAlign: 'center',
    },
    button: {
        width: scale(148),
        height: scale(45),
        marginTop: moderateScale(30),
    },
});

export default WelcomePage;



