import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppColors} from '../Utils/Constants';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';

const SimpleHeader = () => {
  const navigation = useNavigation();
  const OnLeftPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={OnLeftPress}>
        <Feather name="arrow-left" color={AppColors.defaultColor} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
  },
  button: {
    padding: moderateScale(15),
    width: moderateScale(60),
  },
});
