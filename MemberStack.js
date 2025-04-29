import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Members from '../Screens/Members/Members';
import MemberProfile from '../Screens/Members/MemberProfile';
import MainMessagesScreen from '../Screens/Messages/MainMessagesScreen';
import ComposeMessagePage from '../Screens/Messages/ComposeMessage/ComposeMessagePage';
import Dashboard from '../Screens/Dashboard/Dashboard';
import DashboardStack from './DashboardStack';

const Stack = createStackNavigator();

const MemberStack = () => {
    return (
        <Stack.Navigator
        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="Members"
                component={Members}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="MemberProfile"
                component={MemberProfile}
            />
            {/*  <Stack.Screen
                options={{ headerShown: false }}
                name="Profile"
                component={Profile}
            /> */}
            <Stack.Screen
                options={{ headerShown: false }}
                name="MainMessagesScreen"
                component={MainMessagesScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="ComposeMessagePage"
                component={ComposeMessagePage}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Dashboard"
                component={DashboardStack}
            />
        </Stack.Navigator>
    );
};

export default MemberStack;