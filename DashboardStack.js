import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../Screens/Dashboard/Account';
import Dashboard from '../Screens/Dashboard/Dashboard';

import GroupStack from './GroupStack';
import Groups from '../Screens/Groups/Groups';
import MyGroupDetailsPage from '../Screens/Groups/MyGroupDetails/MyGroupDetailsPage';
import Members from '../Screens/Members/Members';
import MyGroupMemberDetailsPage from '../Screens/Groups/MyGroupMemberDetails/MyGroupMemberDetailsPage';
import ViewDatesPage from '../Screens/Groups/ViewDates/ViewDatesPage';
import MemberStack from './MemberStack';
import Profile from '../Screens/Dashboard/Profile/Profile';
import ProfileEdit from '../Screens/Dashboard/Profile/ProfileEdit';
import EventDetailsPage from '../Screens/Groups/EventDetails/EventDetailsPage';
import InviteGuestFormPage from '../Screens/Groups/InviteGuestForm/InviteGuestFormPage';
import MainMessagesScreen from '../Screens/Messages/MainMessagesScreen';
import ComposeMessagePage from '../Screens/Messages/ComposeMessage/ComposeMessagePage';


const Stack = createStackNavigator();

const DashboardStack = () => {
    return (
        <Stack.Navigator
        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="Dashboard"
                component={Dashboard}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Account"
                component={Account}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Profile"
                component={Profile}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="ProfileEdit"
                component={ProfileEdit}
            />
            {/* ProfileEdit */}
            <Stack.Screen
                options={{ headerShown: false }}
                name="GroupStack"
                component={GroupStack}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="MemberStack"
                component={MemberStack}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="MyGroupMemberDetailsPage"
                component={MyGroupMemberDetailsPage}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="ViewDatesPage"
                component={ViewDatesPage}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="EventDetailsPage"
                component={EventDetailsPage}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="InviteGuestFormPage"
                component={InviteGuestFormPage}
            />
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
        </Stack.Navigator>
    );
};

export default DashboardStack;