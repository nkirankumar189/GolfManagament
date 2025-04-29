import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RootNavigation from './RootNavigation';
import { PaperProvider } from 'react-native-paper';
import { AppColors } from '../Utils/Constants';
import { useSelector } from 'react-redux';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectUser } from '../Redux/Slices/userSlice';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { isLoading, loadingText } = useSelector(state => state.loader);
  const user = useSelector(selectUser);
  // const { first_name, last_name, profile_photo, group_id, group_name, cdh_whs_number } = user;
  console.log("first_name:", user);

  return (
    <PaperProvider>
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={user == null ? 'dark-content' :(user.user_id != null ? 'light-content' : 'dark-content')}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: user == null ? AppColors.white :(user.user_id != null ? AppColors.defaultColor : AppColors.white) }}>

        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              swipeEnabled: false,
              headerShown: false,
              drawerStyle: {
                backgroundColor: '#c6cbef', //Set Drawer background
                width: 250, //Set Drawer width
              },
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'bold', //Set Header text style
              },
            }}>
            <Drawer.Screen
              name="SecondPage"
              options={{
                drawerLabel: 'Second page Option',
                // title: 'Second Stack'
              }}
              component={RootNavigation}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
};
export default DrawerNavigation;
