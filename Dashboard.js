import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderTop } from '../../Components/MainHeader/HeaderTop';
import CustomImage from '../../Components/CustomImage';
import { moderateScale } from 'react-native-size-matters';
import AppText from '../../Components/AppText';
import CustomFlatList from '../../Components/CustomFlatList';
import { AppColors, DeviceDimentions, FontSizes } from '../../Utils/Constants';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../assets/images/images';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, selectUser, setUser } from '../../Redux/Slices/userSlice';
import LogoutConfirmation from '../../Components/LogoutConfirmation';
import {
  clearStorage,
  Logout,
  setStorageItem,
} from '../../Utils/CustomFunctions/CustomFunctions';
import ApihelperModule from '../../services/ApihelperModule';
import Path from '../../services/Api';
import ComponentLoader from '../../Components/ComponentLoader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);
  const [profileData, setprofileData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const tabNavigation = useNavigation(); // Inside a screen

  const data = [
    { id: '0', title: 'My Profile', image: IMAGES.profile },
    { id: '1', title: 'Groups', image: IMAGES.Groups },
    { id: '2', title: 'Account Details', image: IMAGES.Account },
    { id: '3', title: 'Members', image: IMAGES.Members },
  ];

  const onItemPress = item => {
    if (item.id == 2) {
      navigation.navigate('Account');
    } else if (item.id == 0) {
      navigation.navigate('Profile');
    } else if (item.id == 1) {
      tabNavigation.jumpTo('GroupStack');
    } else if (item.id == 3) {
      tabNavigation.jumpTo('MemberStack');
    }
  };
  const handleLogout = async () => {
    let isLogoutSuccess = await Logout();
    if (isLogoutSuccess) {
      console.log('User logged out');
      setDialogVisible(false);
      clearStorage();
      dispatch(clearUser());
      navigation.dispatch(
        CommonActions.reset({
          index: 1, // Replace the second screen in the stack
          routes: [{ name: 'LoginPage' }],
        }),
      );
    }
  };
  const {
    first_name,
    profile_photo,
    last_name,
    cdh_whs_number
  } = profileData

  useEffect(() => {
    if (isFocused) {
      GetProfileDetails();
    }
  }, [isFocused]);
  const GetProfileDetails = async () => {
    setLoader(true)
    ApihelperModule.getData(Path.getMyProfile).then((response) => {
      if (response.data != "" && response.data != null && response.data != undefined) {
        if (response.data.success) {
          setLoader(false)
          dispatch(setUser(response.data.memberData));
          setStorageItem("memberData", response.data.memberData)
          setprofileData(response.data.memberData)
        } else {
          setLoader(false)
        }
      } else {
        setLoader(false)
      }
    }).catch((err) => {
      setLoader(false)
    })
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => onItemPress(item)}
      activeOpacity={0.8}
      style={styles.item}>
      <CustomImage
        source={item.image}
        placeholderSource={IMAGES.logo_blue}
        style={styles.itemImage}
        resizeMode="cover"
        showLoadingIndicator={true}
      />
      <AppText styleText={styles.itemTitle} children={item.title} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderTop title="Dashboard" />
        <LogoutConfirmation
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          onConfirm={handleLogout}
        />
        {loader ?
          <View style={styles.loaderContainer}>
            <ComponentLoader
              size="large"
              color={AppColors.defaultColor}
              style={{}}
            />
          </View>
          :
          <>
            <View style={styles.imageContainer}>
              <View>
                {cdh_whs_number &&
                  <View style={styles.batch}>
                    <AppText styleText={styles.batchtext} children={cdh_whs_number} />
                  </View>
                }
                {console.log("profile_photo:", profile_photo)}
                <CustomImage
                  source={profile_photo ? { uri: profile_photo } : null}
                  placeholderSource={IMAGES.logo_blue}
                  style={styles.image}
                  resizeMode="cover"
                  showLoadingIndicator={true}
                />

              </View>
              {first_name &&
                <AppText
                  styleText={styles.text}
                  children={first_name + ' ' + last_name}
                />
              }
            </View>
            <CustomFlatList
              numColumns={2}
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              emptyListMessage="No items found!"
            />
          </>
        }
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoutText: {
    color: AppColors.red,
    padding: moderateScale(12),
    fontWeight: '500',
    fontSize: moderateScale(FontSizes.medium),
  },
  logoutimage: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  logoutButton: {
    backgroundColor: AppColors.white,
    margin: moderateScale(12),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: DeviceDimentions.width - moderateScale(18),
  },
  image: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: 16,
  },
  imageContainer: {
    margin: moderateScale(30),
    alignItems: 'center',
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(FontSizes.xlarge),
    fontWeight: '700',
    color: AppColors.black,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: DeviceDimentions.width / 2.2,
    height: DeviceDimentions.width / 2.2,
    margin: moderateScale(6),
    borderRadius: 15,
  },
  itemImage: {
    width: moderateScale(42),
    height: moderateScale(42),
    resizeMode: 'cover',
  },
  itemTitle: {
    color: AppColors.defaultColor,
    fontSize: moderateScale(FontSizes.medium),
    fontWeight: '700',
    paddingTop: moderateScale(10),
  },
  batch: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 10,
    right: 5,
    top: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchtext: {
    fontSize: moderateScale(FontSizes.small),
    color: AppColors.white,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    height: DeviceDimentions.height / 1.1,
    width: '100%'
    , alignItems: 'center',
    justifyContent: 'center'
  },
});
