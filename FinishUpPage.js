import React from "react";
import { StyleSheet, StatusBar, SafeAreaView } from "react-native";
import FinishUpContaner from "./FinishUpContaner";
// import { SafeAreaView } from "react-native-safe-area-context";

const FinishUpPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} />
      <FinishUpContaner />
    </SafeAreaView>
  );
};

export default FinishUpPage;

const styles = StyleSheet.create({
  safeArea: {
    flex:1,
    backgroundColor: "#fff",
  },
});