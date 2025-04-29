// EspTextInput.js
import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const EspTextInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    style,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, style]}
                value={value}
                placeholderTextColor={'#777777'}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                {...props}
            />
        </View>
    );
};


export default EspTextInput;
const styles = StyleSheet.create({
});