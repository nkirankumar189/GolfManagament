import React ,{useState} from "react";
import { useNavigation } from "@react-navigation/native";
import {StyleSheet, View, Text, TextInput, SafeAreaView, Alert } from "react-native";
import CustomTextInput from "../Components/CustomTextInput";
import AppText from "../Components/AppText";
import { RadioButton } from 'react-native-paper';
import { CheckBox,Button } from '@rneui/themed';
import CustomButton from "../Components/CustomButton";
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginPage = () => {
  const navigation = useNavigation();
  const [check1, setCheck1] = useState(false);


  return (
    // <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Icon name="rocket" size={50} color="#900" />

<AppText
styleText={{padding:20,fontSize:20,fontWeight:"bold",right:15}}
    //   textAlign={"right"}
      children={"Account Login"}
      />
        <CustomTextInput
        label={"E Mail Address"}
        />
     <CustomTextInput
        label={"Password"}
        />

        <View style={styles.row}>
        <CheckBox
      center
      title="Remember Me"
      checked={check1}
      onPress={() => setCheck1(!check1)}
    />
     
      <AppText
      onPress={()=>{
    navigation.navigate("ResetScreen")
      }}
styleText={{padding:20,fontSize:15,color:"blue"}}
    //   textAlign={"right"}
    viewStyle={{marginRight:0}}
      children={"Reset Password?"}
      /> 
        </View>

        <View>
        <CustomButton
              title={'Login'}
              onPress={()=>{
                Alert.alert("Work in Progress...")
              }}
              containerStyle={{
                width: 380,
                // borderRadius:10,
                // marginHorizontal: 50,
                marginVertical: 10,
              }}
              color={"#fff"}
            />
        </View>
      </View>
    // {/* </SafeAreaView> */}
  );
};

export default LoginPage;

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
