import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, SafeAreaView, Alert, StatusBar } from "react-native";
import PaymentInformationContainer from "./PaymentInformationContainer";


const PaymentInformationPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={"dark-content"} />
      <PaymentInformationContainer />
    </SafeAreaView>
  );
};

export default PaymentInformationPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});