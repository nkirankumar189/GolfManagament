import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { IMAGES } from '../../../assets/images/images';
import AppText from '../../../Components/AppText';
import { AppColors, DeviceDimentions, FontSizes } from '../../../Utils/Constants';
import { HeaderTop } from '../../../Components/MainHeader/HeaderTop';
import CustomImage from '../../../Components/CustomImage';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../Redux/Slices/loaderSlice';
import api from '../../../services/ApihelperModule';
import Path from '../../../services/Api';
import ComponentLoader from '../../../Components/ComponentLoader';
import Feather from 'react-native-vector-icons/Feather';
import LogoutConfirmation from '../../../Components/LogoutConfirmation';
import openURL, {
  clearStorage,
  Logout,
  openDialer,
  openGmail,
  openMaps,
} from '../../../Utils/CustomFunctions/CustomFunctions';
import { clearUser } from '../../../Redux/Slices/userSlice';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileData, setprofileData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const {
    member_id,
    user_id,
    group_id,
    group_name,
    first_name,
    profile_photo,
    last_name,
    phone_number,
    email,
    business_name,
    business_phone_number,
    business_sector,
    address_line_one,
    address_line_two,
    business_town_city,
    business_county,
    business_postcode,
    display_address,
    service_area,
    website_address,
    about_business,
    network_help,
    business_logo,
    cdh_whs_number,
    linked_in_url,
    facebook_url,
    position,
  } = profileData;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      GetProfileDetails();
    }
  }, [isFocused]);
  const GetProfileDetails = async () => {
    setLoader(true);
    dispatch(showLoader());
    // setLoader(true);
    api.getData(Path.getMyProfile).then(response => {
      if (
        response.data != '' &&
        response.data != null &&
        response.data != undefined
      ) {
        if (response.data.success) {
          dispatch(hideLoader());
          setLoader(false);
          setprofileData(response.data.memberData);
          //setReturnMessage(response.data.message)
        } else {
          dispatch(hideLoader());
          setLoader(false);
          // setReturnMessage(response.data.message)
        }
      } else {
        dispatch(hideLoader());
        setLoader(false);
        //  setReturnMessage("")
      }
    })
      .catch(err => {
        dispatch(hideLoader());
        setLoader(false);
      });
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


  return (
    <SafeAreaView style={styles.container}>
      <HeaderTop title="My Profile" />
      <LogoutConfirmation
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onConfirm={handleLogout}
      />
      {loader ? (
        <View style={styles.loaderContainer}>
          <ComponentLoader
            size="large"
            color={AppColors.defaultColor}
            style={{}}
          />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.DetailsConatiner}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProfileEdit', { profileData: profileData })
              }
              style={{ alignSelf: 'flex-end' }}>
              <CustomImage
                source={IMAGES.edit}
                placeholderSource={IMAGES.edit}
                style={styles.editicon}
                resizeMode="cover"
                showLoadingIndicator={true}
              />
            </TouchableOpacity>
            <View>
              {cdh_whs_number &&
                <View style={styles.batch}>
                  <AppText
                    styleText={styles.batchtext}
                    children={cdh_whs_number}
                  />
                </View>
              }
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
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              {position &&
                <AppText styleText={styles.sectortext} children={position + ' |'} />
              }
              {business_sector &&
                <AppText styleText={styles.sectortext} children={business_sector} />
              }
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* <Image source={IMAGES.Groups} style={styles.sector} /> */}

              {business_county &&
                <>
                  <CustomImage
                    source={IMAGES.Groups}
                    placeholderSource={IMAGES.logo_blue}
                    style={styles.sector}
                    resizeMode="cover"
                    showLoadingIndicator={true}
                  />
                  <AppText
                    styleText={styles.sectortext}
                    children={business_county}
                  />
                </>

              }
            </View>
          </View>

          {/* Membership Details */}
          <View style={styles.detailsConatiner}>
            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={'Membership No:'} />
              <AppText styleText={styles.subtextValue} children={member_id} />
            </View>
            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={'Join Date:'} />
              <AppText
                styleText={styles.subtextValue}
                children={'12/03/2025'}
              />
            </View>
          </View>
          {/* Contact Details */}
          <View style={styles.detailsConatiner}>
            <AppText
              styleText={styles.HeaderText}
              children={'Contact Details'}
            />
            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={'Email Address:'} />
              <AppText onPress={() => openGmail(email)} styleText={styles.subtextValue} children={email} />
            </View>
            <TouchableOpacity onPress={() => openDialer(phone_number)} style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={'Phone Number:'} />
              <AppText
                styleText={styles.subtextValue}
                children={phone_number}
              />
            </TouchableOpacity>
            {linked_in_url &&
              <View style={styles.dataItemConatiner}>
                <AppText styleText={styles.subtext} children={'Linkedin:'} />
                <AppText
                  numberOfLines={1}
                  onPress={() => openURL(linked_in_url)}
                  styleText={[styles.subtextValue, { color: AppColors.link, width: DeviceDimentions.width / 1.4 }]}
                  children={linked_in_url}
                />
              </View>
            }

            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={'Facebook:'} />
              <AppText
                numberOfLines={1}
                onPress={() => openURL(facebook_url)}
                styleText={[styles.subtextValue, { color: AppColors.link, width: DeviceDimentions.width / 1.4 }]}
                children={facebook_url}
              />
            </View>
          </View>
          {/* About Me */}
          <View style={styles.detailsConatiner}>
            <AppText styleText={styles.HeaderText} children={'About Me'} />
            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={about_business} />
            </View>
          </View>
          {/* What I’m Looking For */}
          <View style={styles.detailsConatiner}>
            <AppText
              styleText={styles.HeaderText}
              children={'What I’m Looking For'}
            />
            <View style={styles.dataItemConatiner}>
              <AppText styleText={styles.subtext} children={network_help} />
            </View>
          </View>
          {/* Business Information */}
          <View style={styles.detailsConatiner}>
            <AppText
              styleText={styles.HeaderText}
              children={'Business Information'}
            />
            <CustomImage
              source={{ uri: business_logo }}
              placeholderSource={IMAGES.logo_blue}
              style={[styles.image, { marginBottom: 10, marginTop: 5 }]}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
            <View style={[styles.dataItemConatiner, { flexDirection: 'column' }]}>
              <AppText styleText={styles.subtext} children={'Business Name:'} />
              <AppText
                styleText={styles.subtextValue}
                children={business_name}
              />
            </View>
            <View style={[styles.dataItemConatiner, { flexDirection: 'column' }]}>
              <AppText
                styleText={styles.subtext}
                children={'Business Sector:'}
              />
              <AppText
                styleText={styles.subtextValue}
                children={business_sector}
              />
            </View>
            <TouchableOpacity onPress={() => openDialer(business_phone_number)} style={[styles.dataItemConatiner, { flexDirection: 'column' }]}>
              <AppText
                styleText={styles.subtext}
                children={'Business Phone Number:'}
              />
              <AppText
                styleText={styles.subtextValue}
                children={business_phone_number}
              />
            </TouchableOpacity>

            {display_address && (
              <View
                style={[styles.dataItemConatiner, { flexDirection: 'column' }]}>
                <AppText
                  styleText={styles.subtext}
                  children={'Business Address:'}
                />
                <TouchableOpacity onPress={() => openMaps((address_line_one && address_line_one + ', ') +
                  (address_line_two && address_line_two + ', ') +
                  (business_town_city && business_town_city + ', ') +
                  (business_postcode && business_postcode + ', ') +
                  (business_county && business_county))}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: DeviceDimentions.width / 1.1,
                    flex: 1,
                  }}>
                  <AppText
                    styleText={styles.subtextValue}
                    children={
                      (address_line_one && address_line_one + ', ') +
                      (address_line_two && address_line_two + ', ') +
                      (business_town_city && business_town_city + ', ') +
                      (business_postcode && business_postcode + ', ') +
                      (business_county && business_county)
                    }
                  />
                  {/* <AppText
                                        styleText={styles.subtextValue}
                                        children={address_line_two && address_line_two + " "}
                                    /> */}
                  {/* <AppText
                                        styleText={styles.subtextValue}
                                        children={business_town_city && business_town_city + " "}
                                    />
                                    <AppText
                                        styleText={styles.subtextValue}
                                        children={business_postcode && business_postcode + " "}
                                    />
                                    <AppText
                                        styleText={styles.subtextValue}
                                        children={business_county && business_county}
                                    /> */}
                </TouchableOpacity>
              </View>
            )}
            <View style={[styles.dataItemConatiner, { flexDirection: 'column' }]}>
              <AppText styleText={styles.subtext} children={'Website:'} />
              <AppText
                numberOfLines={1}
                onPress={() => openURL(website_address)}
                styleText={[styles.subtextValue, { color: AppColors.link, width: DeviceDimentions.width / 1.2 }]}
                children={website_address}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setDialogVisible(true)}
            activeOpacity={0.8}
            style={styles.logoutButton}>
            <AppText
              styleText={[styles.logoutText, { color: AppColors.red }]}
              children={'Log out'}
            />
            <Feather name="log-out" color={AppColors.red} size={18} />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoutText: {
    color: AppColors.red,
    padding: moderateScale(12),
    fontWeight: "500",
    fontSize: moderateScale(FontSizes.small),
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
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DetailsConatiner: {
    backgroundColor: AppColors.white,
    width: DeviceDimentions.width - moderateScale(20),
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    alignItems: 'center',
    borderRadius: 15,
    padding: moderateScale(10),
  },
  subtext: {
    fontSize: moderateScale(FontSizes.small),
    color: '#777777',
    textAlign: 'left',
    paddingRight: moderateScale(5),
    fontWeight: "500",
  },
  subtextValue: {
    fontSize: moderateScale(FontSizes.small),
    fontWeight: "500",
    color: '#000',
    textAlign: 'left',
    paddingBottom: 8,
  },
  image: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: 16,
    // marginVertical:moderateScale(10)
  },
  socialImages: {
    width: DeviceDimentions.width / 8.3,
    height: DeviceDimentions.width / 8.3,
    borderRadius: 16,
  },
  imageContainer: {
    margin: moderateScale(30),
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(FontSizes.xlarge),
    fontWeight: '700',
    color: '#000000',
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
  sector: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  sectortext: {
    color: '#000',
    paddingLeft: 5,
    fontSize: moderateScale(FontSizes.small),
    fontWeight: "500",
  },
  sectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonsConater: {
    marginHorizontal: moderateScale(10),
    flexDirection: 'row',
    height: moderateScale(45),
    alignItems: 'center',
  },
  MessageButton: {
    backgroundColor: AppColors.defaultColor,
    borderRadius: moderateScale(10),
    height: '100%',
    justifyContent: 'center',
    width: DeviceDimentions.width / 1.72,
    marginRight: moderateScale(5),
  },
  MessageButtontxt: {
    color: AppColors.white,
    fontWeight: '500',
    fontSize: moderateScale(FontSizes.small),
    textAlign: 'center',
  },
  Sharebutton: {
    backgroundColor: '#777777',
    borderRadius: 5,
    width: DeviceDimentions.width / 9,
    height: DeviceDimentions.width / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsConatiner: {
    backgroundColor: AppColors.white,
    width: DeviceDimentions.width - moderateScale(20),
    marginTop: moderateScale(10),
    marginHorizontal: moderateScale(10),
    alignItems: 'flex-start',
    borderRadius: 15,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
  },
  dataItemConatiner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    paddingTop: 5
  },
  HeaderText: {
    color: AppColors.black,
    fontWeight: '500',
    fontSize: moderateScale(FontSizes.large),
  },
  editicon: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
});
