import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { AppColors, FontSizes } from '../Utils/Constants';

const OtpInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];

        if (text === '') {
            newOtp[index] = '';
            setOtp(newOtp);
            return;
        }

        if (/^\d$/.test(text)) {
            newOtp[index] = text;
            setOtp(newOtp);

            onComplete && onComplete(newOtp.join(''));
            if (index < length - 1) {
                inputs.current[index + 1].focus();
            } else {
                inputs.current[index].blur();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputs.current[index - 1].focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((value, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    value={value}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    style={styles.input}
                    cursorColor={AppColors.defaultColor}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        // backgroundColor:'red'
    },
    input: {
        width: moderateScale(45),
        height: moderateScale(50),
        borderWidth: 1,
        borderColor: AppColors.borderColor,
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: moderateScale(FontSizes.xlarge),
    },
});

export default OtpInput;
