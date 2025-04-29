import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {AppColors, DeviceDimentions, FontSizes} from '../Utils/Constants';
import {moderateScale, scale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTextInput = props => {
  const {
    onChangeText,
    value,
    placeholder,
    keyboardType,
    label,
    containerStyle,
    multiline,
    maxLength,
    editable,
    autoComplete,
    secureTextEntry,
    numberOfLines,
    textAlignVertical,
    textInputStyle,
    required,
    error, // New prop for error message
    placeholderTextColor,
    OnEyePress,
    inputMode,
    textContentType,
    onPress,
    autoCapitalize,
  } = props;

  return (
    <View style={containerStyle}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: moderateScale(4),
        }}>
        <Text style={styles.text}>{label}</Text>
        {required && <Text style={styles.star}>*</Text>}
      </View>
      <View
        style={[
          styles.container(editable)
        ]}>
        <TextInput
          onPress={onPress}
          style={[styles.input, {...textInputStyle}]}
          onChangeText={onChangeText}
          value={value}
          inputMode={inputMode}
          textContentType={textContentType}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          autoCapitalize={autoCapitalize}
        />
        {label == 'Password' && (
          <TouchableOpacity style={{marginLeft: 10}} onPress={OnEyePress}>
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              color={AppColors.black}
              size={24}
            />
          </TouchableOpacity>
        )}
        {label == 'Confirm Password' && (
          <TouchableOpacity style={{marginLeft: 10}} onPress={OnEyePress}>
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              color={AppColors.black}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Display error message if error exists */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: editable => ({
    borderWidth: 1,
    borderColor: '#ccc',
    width: DeviceDimentions.width / 1.2,
    paddingHorizontal: 8,
    borderRadius: 8,
    // marginBottom: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: editable == false ? AppColors.gray1 : AppColors.white,
  }),
 
  input: {
    color: '#000',
    flex: 1,
    fontSize: moderateScale(FontSizes.small),
    height: scale(40),
  },
  text: {
    fontSize: moderateScale(FontSizes.small),
    color: AppColors.black,
    right: moderateScale(2),
    fontWeight: '500',
  },
  star: {
    color: AppColors.red,
    fontSize: moderateScale(FontSizes.medium),
    paddingLeft: 2,
  },
  errorText: {
    color: AppColors.red, // Red color for error messages
    fontSize: moderateScale(FontSizes.verysmall),
    paddingBottom: 5,
    paddingLeft:5
  },
  errorContainer: {
    borderColor: AppColors.red, // Highlight input border in red if there's an error
  },
});
