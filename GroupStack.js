import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Groups from '../Screens/Groups/Groups';
import MyGroupDetailsPage from '../Screens/Groups/MyGroupDetails/MyGroupDetailsPage';
import MyGroupMemberDetailsPage from '../Screens/Groups/MyGroupMemberDetails/MyGroupMemberDetailsPage';
import ViewDatesPage from '../Screens/Groups/ViewDates/ViewDatesPage';
import EventDetailsPage from '../Screens/Groups/EventDetails/EventDetailsPage';
import InviteGuestFormPage from '../Screens/Groups/InviteGuestForm/InviteGuestFormPage';
import BrowseGroups from '../Screens/Groups/BrowseGroups/BrowseGroups';
import GroupDetails from '../Screens/Groups/BrowseGroups/GroupDetails';
import MyVisitScreen from '../Screens/MyVisits/MyVisitScreen';
import BrowseEventDetailsPage from '../Screens/Groups/BrowseGroups/BrowseEventDetails/BrowseEventDetailsPage';
import MainMessagesScreen from '../Screens/Messages/MainMessagesScreen';
import ComposeMessagePage from '../Screens/Messages/ComposeMessage/ComposeMessagePage';

const Stack = createStackNavigator();

const GroupStack = () => {
    return (
        <Stack.Navigator
        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="Groups"
                component={Groups}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="MyGroupDetailsPage"
                component={MyGroupDetailsPage}
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
                name="BrowseGroups"
                component={BrowseGroups}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="GroupDetails"
                component={GroupDetails}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="MyVisitScreen"
                component={MyVisitScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="BrowseEventDetailsPage"
                component={BrowseEventDetailsPage}
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

export default GroupStack;