import React ,{useState} from "react";
import { useNavigation } from "@react-navigation/native";
import {StyleSheet, View, Text, TextInput, SafeAreaView, Alert } from "react-native";
import CustomTextInput from "../Components/CustomTextInput";
import AppText from "../Components/AppText";
import { RadioButton } from 'react-native-paper';
import { CheckBox,Button } from '@rneui/themed';
import CustomButton from "../Components/CustomButton";

const ResetScreen = () => {
  const navigation = useNavigation();
  const [check1, setCheck1] = useState(false);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

<AppText
styleText={{padding:20,fontSize:20,fontWeight:"bold",right:10}}
      children={"Reset Password"}
      />
        <CustomTextInput
        label={"New Password"}
        />
     <CustomTextInput
        label={"Conform Password"}
        />

    
        <View style={{margin:10}}>
        <CustomButton
              title={'Set Password'}
              onPress={()=>{
                Alert.alert("Work in Progress...")
              }}
              containerStyle={{
                width: 380,
                // marginHorizontal: 50,
                marginVertical: 10,
              }}
              color={"#fff"}
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
    backgroundColor: "#fff", 
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row:{
    flexDirection:"row",
  alignItems:"center"
  }
});
