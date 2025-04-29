import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppColors } from '../Utils/Constants';
import UpcomingVisitsPage from '../Screens/MyVisits/UpcomingVisits/UpcomingVisitsPage';
import PastVisitsPage from '../Screens/MyVisits/PastVisits/PastVisitsPage';

const Tab = createMaterialTopTabNavigator();

export const MyVisitTopTabNavigation = (props) => {

  const { visitFlag } = props;

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
        },
        tabBarIndicatorStyle: {
          borderBottomColor: '#000',
          borderBottomWidth: 2,
        },
      }}
    >
      <Tab.Screen name="Upcoming" component={UpcomingVisitsPage} initialParams={{ visitFlag }} />
      <Tab.Screen name="Past Visits" component={PastVisitsPage} initialParams={{ visitFlag }}  />
    </Tab.Navigator>
  );
}