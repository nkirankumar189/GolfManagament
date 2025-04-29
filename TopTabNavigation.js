import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MembersPage from '../Screens/Groups/MembersScreen/MembersPage';
import VisitorsPage from '../Screens/Groups/VisitorsScreen/VisitorsPage';
import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { AppColors } from '../Utils/Constants';
import { moderateScale } from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

export const TopTabNavigation = (props) => {

  const { members,visitors } = props;
  const totalM = members != undefined || members != null ? members && members.length : null
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: '#fff', // Active tab text color (White)
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderRadius: 5
        },
        tabBarLabelStyle: {
          textAlign: 'center',
          fontSize: 20
        },
        tabBarIndicatorStyle: {
          borderBottomColor: '#000',
          borderBottomWidth: 2,
        },
      }}
    >
      <Tab.Screen
        name="Members"
        component={MembersPage}
        options={{
          tabBarLabel: () => (
            <View style={styles.tabLabel}>
              <Text style={styles.memberCount}>
                {totalM}
              </Text>
              <Text style={styles.tabText}> Members</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Visitors"
        component={VisitorsPage}
        options={{
          tabBarLabel: () => (
            <View style={styles.tabLabel}>
              <Text style={styles.memberCount}>
                {visitors?.length}
              </Text>
              <Text style={styles.tabText}> Visitors</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    flexDirection: 'row', alignItems: 'center'
  },
  memberCount: {
    color: AppColors.defaultColor,
    fontSize: moderateScale(20),
    fontWeight: 'bold'
  },
  tabText: {
    fontSize: moderateScale(16)
  }
})