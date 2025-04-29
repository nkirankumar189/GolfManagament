import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppText = (props) => {
  const {
    children,
    color,
    fontSize,
    fontWeight,
    textAlign,
    numberOfLines,
    styleText,
    viewStyle,
    onPress,
    disabled
  } = props;

  return (
    <View style={[styles.container, { ...viewStyle }]}>
      <Text
        disabled={disabled}
        style={[
          styles.text,
          // { color, fontSize, fontWeight, textAlign },
          styleText,
        ]}
        numberOfLines={numberOfLines}
        onPress={onPress}
      >
        {children}
      </Text>
    </View>
  );
};
export default AppText;

const styles = StyleSheet.create({
  container: {
    // marginRight:200
  },
  text: {
    textAlign: 'center',
    marginBottom: 2

  },
});