// React Native Navigation Drawer
// https://aboutreact.com/react-native-navigation-drawer/
import 'react-native-gesture-handler';
import * as React from 'react';
import DrawerNavigation from './src/Navigations/DrawerNavigation';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store';
import { loadUser } from './src/Redux/Slices/userSlice';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import { AppColors, DeviceDimentions, FontSizes } from './src/Utils/Constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

const App = () => {
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <DrawerNavigation />
      {!isConnected &&
        <View style={styles.banner}>
          {/* <CustomImage
            source={IMAGES.no_internet}
            style={styles.no_internet}
            resizeMode={'conatin'}
          /> */}
          {/* <View style={styles.textConteiner}>
            <Text style={styles.bannerText}>No Internet</Text>
            <Text style={[styles.bannerText, { fontWeight: '900' }]}>Connection</Text>
            </View> */}
          <Text style={styles.message}></Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="alert-circle" color={AppColors.white} size={20} />
            <Text style={styles.message}>Could not connect to internet</Text>
          </View>
          {/* <TouchableOpacity onPress={() => openInternetSettings()} style={styles.tryGainButton}>
              <Text style={[styles.message, { color: AppColors.black, textAlign: 'center' }]}>Try again</Text>
            </TouchableOpacity> */}
        </View>
      }
    </Provider>
  );
}

export default App;
const styles = StyleSheet.create({
  banner: {
    backgroundColor: AppColors.red,
    height: DeviceDimentions.height / 10.5,
    position: 'absolute',
    top: 0,
    width: DeviceDimentions.width,
    alignItems: 'center',
    justifyContent: 'center'
    // paddingVertical: verticalScale(10),
    //  paddingHorizontal: moderateScale(40),
    // alignItems: 'center',
    // justifyContent: 'center',
    // zIndex: 1000,
    // flex: 1
  },
  bannerText: {
    color: AppColors.white,
    fontSize: scale(FontSizes.xxxlarge),
  },
  message: {
    fontSize: scale(FontSizes.verysmall),
    color: AppColors.white,
    fontWeight: '500',
    paddingVertical: verticalScale(5),
    paddingLeft: 10
  },
  tryGainButton: {
    backgroundColor: AppColors.white,
    width: DeviceDimentions.width / 4,
    borderRadius: 100,
    marginVertical: verticalScale(10)
  },
  no_internet: {
    width: moderateScale(DeviceDimentions.width / 3),
    height: verticalScale(DeviceDimentions.width / 4),
    alignSelf: 'center',
    tintColor: AppColors.white
  },
  textConteiner: {
    marginTop: verticalScale(50)
  }
});