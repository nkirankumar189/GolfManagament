import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppColors } from '../Utils/Constants';
import CustomImage from '../Components/CustomImage';
import { moderateScale } from 'react-native-size-matters';
import Groups from '../Screens/Groups/Groups';
import DashboardStack from './DashboardStack';
import { IMAGES } from '../assets/images/images';
import MemberStack from './MemberStack';
import GroupStack from './GroupStack';
import { StyleSheet, View } from 'react-native';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

    return (
        <Tab.Navigator
            initialRouteName='DashboardStack'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'DashboardStack') {
                        iconName = focused ? IMAGES.HomeWhite : IMAGES.HomeOutline;//
                    } else if (route.name === 'MemberStack') {
                        iconName = focused ? IMAGES.MembersWhite : IMAGES.MembersOutline;
                    }
                    else if (route.name === 'GroupStack') {
                        iconName = focused ? IMAGES.GroupsWhite : IMAGES.GroupsOutline;
                    }

                    // You can return any component that you like here!
                    return (
                        <View style={{ alignItems: 'center' }}>
                            <CustomImage
                                source={iconName}
                                placeholderSource={IMAGES.logo_blue}
                                style={{ width: 30, height: 30 }}
                                resizeMode="cover"
                                showLoadingIndicator={true}
                            />
                            {focused &&
                            <View style={styles.activebarstyle} />                            
                            }
                        </View>);
                },
                tabBarShowLabel: false, // This hides the tab bar titles
                tabBarStyle: {
                    backgroundColor: AppColors.defaultColor,
                    paddingTop: moderateScale(8),
                    height: 60,

                }
            })}
        >
            <Tab.Screen name="MemberStack" component={MemberStack} />
            <Tab.Screen name="DashboardStack"
                component={DashboardStack} // Use the stack navigator here
                options={{ headerShown: false }} />
            <Tab.Screen name="GroupStack" component={GroupStack} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
    activebarstyle: { backgroundColor: AppColors.white, height: 4, width: 100, marginTop: 10, borderRadius: 50 }
})