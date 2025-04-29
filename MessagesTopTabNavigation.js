import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppColors } from '../Utils/Constants';
import One2OneMessagesPage from '../Screens/Messages/One2OneMessages/One2OneMessagesPage';
import MyGroupMessagesPage from '../Screens/Messages/MyGroupMessages/MyGroupMessagesPage';
import HeadOfficeMessagesPage from '../Screens/Messages/HeadOfficeMessages/HeadOfficeMessagesPage';

const Tab = createMaterialTopTabNavigator();

export const MessagesTopTabNavigation = (props) => {


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fff', // Active tab text color (White)
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: {
          backgroundColor: AppColors.defaultColor,
          //   borderRadius:5
        },
        tabBarLabelStyle: {
            textAlign: 'center',
            fontSize: 18,
            // fontWeight: 'bold',
        },
        tabBarIndicatorStyle: {
          borderBottomColor: '#fff',
          borderBottomWidth: 2,
        },
      }}
    >
      <Tab.Screen name={`1-2-1`} component={One2OneMessagesPage}  />
      <Tab.Screen name="Head Office" component={HeadOfficeMessagesPage}   />
      <Tab.Screen name="My Group" component={MyGroupMessagesPage}   />
    </Tab.Navigator>
  );
}