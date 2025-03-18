import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CustomTextInput = (props) => {
  const {
    onChangeText,
    value,
    placeholder,
    keyboardType,
    label
  } = props;

  return (
    <View style={{}}>
  <View >
    <Text style={styles.text}>{label}</Text>
  </View>
  <View style={styles.container}>
  <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
  </View>
     
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 380,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  input: {
    height: 35,
    color: '#000',
  },
  text:{
    fontSize:14,
    padding:8,
    right:8,
    // marginHorizontal:8,
    // fontWeight:"bold"
  }
});
