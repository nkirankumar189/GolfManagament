import React from "react";
import { StyleSheet,View } from "react-native";
import { Button } from "@rneui/themed";

const CustomButton = ({
  title,
  onPress,
  backgroundColor,
  color ,
  borderRadius = 8,
  size = "md", // 'sm', 'md', 'lg'
  icon,containerStyle,
  disabled = false,
}) => {
  return (
    <View>
    <Button
      title={title}
      onPress={onPress}
    //   rgb(255, 255, 255)
    //   buttonStyle={[
    //     styles.button,
    //     {
    //       backgroundColor,
    //       borderRadius,
    //       paddingVertical: size === "sm" ? 8 : size === "lg" ? 16 : 12,
    //     },
    //   ]}
      titleStyle={[styles.title, { color }]}
      icon={icon}
      disabled={disabled}
      containerStyle={containerStyle}

    />
    </View>
  );
};

export default CustomButton;


const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    // fontWeight: "bold",
  }
});

