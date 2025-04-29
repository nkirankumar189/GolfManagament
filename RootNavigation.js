

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginPage from '../Screens/LoginScreen/LoginPage';
import ResetPage from '../Screens/ResetScreen/ResetPage';
import SplashScreen from '../Screens/SplashScreen';
import JoinNowPage from '../Screens/JoinNow/JoinNowScreen/JoinNowPage';
import ChooseGroupPage from '../Screens/JoinNow/ChooseGroup/ChooseGroupPage';
import ConformInformationPage from '../Screens/JoinNow/ConformInformation/ConformInformationPage';
import PaymentInformationPage from '../Screens/JoinNow/PaymentInformation/PaymentInformationPage';
import FinishUpPage from '../Screens/JoinNow/FinishUp/FinishUpPage';
import WelcomePage from '../Screens/JoinNow/FinishUp/WelcomePage';
import DashBoardmainScreen from '../Screens/Dashboard/DashBoardmainScreen';
import MemberProfile from '../Screens/Members/MemberProfile';
import { TopTabNavigation } from './TopTabNavigation';
import { MyVisitTopTabNavigation } from './MyVisitTopTabNavigation';
import MainMessagesScreen from '../Screens/Messages/MainMessagesScreen';
import { MessagesTopTabNavigation } from './MessagesTopTabNavigation';
import ChoosePassword from '../Screens/JoinNow/ChoosePassword';


const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen} />
      <Stack.Screen
        name="LoginPage"
        component={LoginPage} />
      <Stack.Screen
        name="ResetPage"
        component={ResetPage} />
      
      <Stack.Screen
        name="JoinNowPage"
        component={JoinNowPage}
      />
      <Stack.Screen
        name="ChoosePassword"
        component={ChoosePassword}
      />
      <Stack.Screen
        name="ChooseGroupPage"
        component={ChooseGroupPage}
      />
      <Stack.Screen
        name="ConformInformationPage"
        component={ConformInformationPage}
      />
      <Stack.Screen
        name="PaymentInformationPage"
        component={PaymentInformationPage}
      />
      <Stack.Screen
        name="FinishUpPage"
        component={FinishUpPage}
      />
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
      />
      <Stack.Screen
        name="DashBoardmainScreen"
        component={DashBoardmainScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MemberProfile"
        component={MemberProfile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="TopTabNavigation"
        component={TopTabNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MyVisitTopTabNavigation"
        component={MyVisitTopTabNavigation}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="MessagesTopTabNavigation"
        component={MessagesTopTabNavigation}
      />
    </Stack.Navigator>
  );
}

export default RootNavigation;