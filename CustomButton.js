import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FontSizes } from "../Utils/Constants";

const CustomButton = ({
  title,
  onPress,
  backgroundColor = "#FFF", // default iOS blue
  color = "#fff",
  borderRadius = 8,
  size = "md", // 'sm', 'md', 'lg'
  icon,
  containerStyle,
  disabled = false,
  titleStyle,
}) => {
  const getPadding = () => {
    switch (size) {
      case "sm":
        return 8;
      case "lg":
        return 16;
      default:
        return 12;
    }
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: disabled ? "#ccc" : backgroundColor,
            borderRadius,
            paddingVertical: getPadding(),
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.title, { color }, titleStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row", // to allow icon + text
  },
  title: {
    fontSize: moderateScale(FontSizes.medium),
    textAlignVertical:'center',
    textAlign:'center'
  },
  icon: {
    marginRight: 8, // space between icon and text
  },
});
