import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
// import { Checkbox, Icon } from '@rneui/themed';
import {
  getStorageItem,
  pickImage,
} from '../../../Utils/CustomFunctions/CustomFunctions';
import CustomImage from '../../../Components/CustomImage';
import CustomTextInput from '../../../Components/CustomTextInput';
import AppText from '../../../Components/AppText';
import { AppColors, DeviceDimentions, FontSizes } from '../../../Utils/Constants';
import { IMAGES } from '../../../assets/images/images';
import CustomButton from '../../../Components/CustomButton';
import Path from '../../../services/Api';
import ComponentLoader from '../../../Components/ComponentLoader';
import ApihelperModule from '../../../services/ApihelperModule';
import FilterPortal from '../../../Components/FilterPortal';
import SectorsPostal from '../../../Components/SectorsPortal';
import SimpleHeader from '../../../Components/SimplaeHeader';
import { Checkbox } from 'react-native-paper';

const FinishUpContaner = () => {
  const [check1, setCheck1] = useState(true);
  const [returnMessage, setReturnMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [businessSectorData, setBusinessSectorData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiError, setApiError] = useState([]);

  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    businessName: '',
    businessSector: {},
    businessPhoneNumber: '',
    businessWebsite: '',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
    postcode: '',
    websiteAddress: '',
    aboutYourself: '',
    networkHelp: '',
    bussinessLogo: {},
    profilephoto: {},
    bussinessLogoName: '',
    cdh_whs_number: '',
    linkedinUrl: '',
    facebookUrl: '',
    serviceArea: '',
    position: "",
  });

  // State for validation errors
  useEffect(() => {
    getBusinessSector();
  }, []);
  const getBusinessSector = async () => {

    let FirstnameTemp = await getStorageItem("FirstnameTemp")
    let LastnameTemp = await getStorageItem("LastnameTemp")
    setFormData({ ...formData, firstName: FirstnameTemp, lastName: LastnameTemp });
    setLoader(true);
    // setLoader(true);
    ApihelperModule.getData(Path.getBusinessSector)
      .then(response => {
        if (
          response.data != '' &&
          response.data != null &&
          response.data != undefined
        ) {
          if (response.data.success) {
            setLoader(false);

            setBusinessSectorData(response.data.data);
            //setReturnMessage(response.data.message)
          } else {
            setLoader(false);
            // setReturnMessage(response.data.message)
          }
        } else {
          setLoader(false);
          //  setReturnMessage("")
        }
      })
      .catch(err => {
        setLoader(false);
      });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    function validateNumber(value) {
      const num = Number(value);
      return String(value).length <= 2 && !isNaN(num) && num <= 99 && num >= 0;
    }
    // Clear error for the field when user starts typing
    if (field == "cdh_whs_number") {
      if (!validateNumber(value)) {
        setErrors({ ...errors, [field]: 'CDH/WHS number should be less then 99.' });
      }
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Validation function
  const validateForm = () => {
    const nameRegex = /^[a-zA-Zà-üÀ-Ü' -]{2,30}$/;
    const postcode = /^([A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2})$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const newErrors = {};
    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.businessName.trim())
      newErrors.businessName = 'Business Name is required';
    if (!formData.businessSector?.sector)
      newErrors.businessSector = 'Business Sector is required';
    if (!formData.businessPhoneNumber.trim())
      newErrors.businessPhoneNumber = 'Business Phone Number is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    if (!formData.businessWebsite.trim())
      newErrors.businessWebsite = 'Business website is required';
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = '1st Line Address is required';
    if (formData.profilephoto.uri == undefined)
      newErrors.profilephoto = 'Profile photo is required';
    // if (errors.cdh_whs_number != '') {
    //   newErrors.cdh_whs_number = 'CDH/WHS number should be less then 99.';
    // }
    // Mobile number validation (example: 10 digits)
    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid Mobile Number';
    }
    if (formData.businessPhoneNumber && !phoneRegex.test(formData.businessPhoneNumber)) {
      newErrors.businessPhoneNumber = 'Invalid Business Mobile Number';
    }
    if (formData.firstName && !nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'Invalid First Name';
    }
    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Invalid Last Name';
    }
    // if (formData.postcode && !postcode.test(formData.postcode)) {
    //     newErrors.postcode = "Invalid Postcode";
    // }
    // Business website validation (example: URL format)
    if (
      formData.businessWebsite &&
      !/^\S+\.\S+$/.test(formData.businessWebsite)
    ) {
      newErrors.businessWebsite = 'Invalid Website URL';
    }
    // Set errors
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSaveChanges = () => {

    if (validateForm()) {
      // Proceed with form submission
      UpdateProfile();
    } else {
      //navigation.navigate("WelcomePage")
      // Alert.alert("Error", "Please fix the errors in the form.");
    }
  };
  const UpdateProfile = async () => {
    let user_id = await getStorageItem("user_id")

    setLoader(true);
    setReturnMessage('');
    // var userToken = await getStorageItem('TempuserToken');
    const myHeaders = new Headers();
    const data = new FormData();
    //myHeaders.append('Authorization', `Bearer ${userToken}`);
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'multipart/form-data');

    data.append('user_id', user_id);
    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('position', formData.position);
    data.append('phone_number', formData.mobileNumber);
    data.append('cdh_whs_number', formData.cdh_whs_number);
    data.append('linkedin_url', formData.linkedinUrl);
    data.append('facebook_url', formData.facebookUrl);
    data.append('about_your_business', formData.aboutYourself);
    data.append('how_can_network_help_you_and_business', formData.networkHelp);
    data.append('business_name', formData.businessName);
    data.append('business_phone_number', formData.businessPhoneNumber);
    data.append('business_sector', formData.businessSector.sector);
    data.append('website_address', formData.businessWebsite);
    data.append('business_address_line_one', formData.addressLine1);
    data.append('business_address_line_two', formData.addressLine2);
    data.append('business_town_city', formData.townCity);
    data.append('business_county', formData.country);
    data.append('business_postcode', formData.postcode);
    data.append('display_address_on_profile', check1 ? '1' : '0');
    data.append('sector_id', formData.businessSector?.id.toString());
    data.append('business_service_area', formData.serviceArea);
    if (!formData.bussinessLogo.type == '') {
      data.append('business_logo', {
        uri: formData.bussinessLogo.uri,
        type: formData.bussinessLogo.type,
        name:
          formData.bussinessLogo.fileName == undefined
            ? ''
            : formData.bussinessLogo.fileName,
      });
    }
    if (!formData.profilephoto.type == '') {
      data.append('profile_photo', {
        uri: formData.profilephoto.uri,
        type: formData.profilephoto.type,
        name:
          formData.profilephoto.fileName == undefined
            ? ''
            : formData.profilephoto.fileName,
      });
    }
    console.log("formData:", data._parts);
    setApiError([])
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    fetch(Path.BaseUrl + Path.createMember, requestOptions)
      .then(response => response.json()) // Changed from text() to json()
      .then(response => {
        console.log("response:", response);

        if (response && typeof response === 'object') {
          if (response.success) {
            setApiError([])
            setSuccessMessage(response.message);
            setTimeout(() => {
              setSuccessMessage('');
              setReturnMessage("")
              navigation.navigate('WelcomePage');
            }, 500);
            setLoader(false);
            // setprofil(response.membe);
            setReturnMessage(response.message);
          } else {
            if (response.errors == undefined) {
              setReturnMessage(response.message);
            } else {
              setApiError(response.errors)
            }
            setLoader(false);
          }
        } else {
          setLoader(false);
          setReturnMessage('Invalid server response');
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
        setReturnMessage('Invalid server response');
      });
  };
  const OnpressUploadProfile = async () => {
    try {
      const image = await pickImage();
      if (image) {
        setFormData({
          ...formData, // Spread the existing state
          profilephoto: image, // Update bussinessLogo with the new image URI
        });
        setErrors({
          ...errors,
          profilephoto: '',
        });
        console.log('Selected image:', image);
        // Do something with the selected image
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const OnpressUploadLogo = async () => {
    try {
      const image = await pickImage();
      if (image) {
        setFormData({
          ...formData, // Spread the existing state
          bussinessLogo: image, // Update bussinessLogo with the new image URI
        });
        console.log('Selected image:', image);
        // Do something with the selected image
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleItemSelect = item => {
    // setSelectedItem(item);
    setFormData({
      ...formData, // Spread the existing state
      businessSector: item, // Update bussinessLogo with the new image URI
    });
    setErrors({
      ...errors,
      businessSector: '',
    });
    setIsModalVisible(false);
  };
  const onCheckpress = data => {
    if (data == 'yes') {
      setCheck1(true);
    } else {
      setCheck1(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        // style={{flex: 1}}
        // contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <SimpleHeader />

        <SectorsPostal
          heading="Business Sector"
          listItems={businessSectorData}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          SelectedFillterItem={handleItemSelect}
        />

        <View style={styles.container}>
          <CustomImage
            source={IMAGES.logo_big}
            placeholderSource={IMAGES.headerLogo}
            style={styles.profileimage}
            resizeMode="cover"
            showLoadingIndicator={true}
          //opacity={0.5}
          />
          <AppText
            styleText={styles.text2}
            children={"Let's finish setting up"}
          />
          <View style={styles.container1}>
            <Text
              style={{
                color: AppColors.black,
                fontSize: moderateScale(FontSizes.small),
                paddingHorizontal: 5, paddingTop: 8, paddingBottom: 5

              }}>
              Profile Photo
              <Text style={{ color: AppColors.red, fontSize: moderateScale(FontSizes.medium) }}> *</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.uploadButton]}
              onPress={() => {
                OnpressUploadProfile()
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: DeviceDimentions.width / 1.3,

                }}>
                <View style={styles.uploadbussinesslogo}>
                  <Text style={styles.buttonText}>Choose file</Text>
                </View>
                <View
                  style={styles.uploadProfileConatainer}>
                  {formData.profilephoto.uri ? (
                    <CustomImage
                      source={{ uri: formData.profilephoto.uri }}
                      placeholderSource={{ uri: formData.profilephoto.uri }}
                      style={styles.profileimage}
                      resizeMode="cover"
                      showLoadingIndicator={true}
                    />
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <CustomImage
                        source={IMAGES.upload}
                        placeholderSource={IMAGES.upload}
                        style={{ width: moderateScale(30), height: moderateScale(30), marginTop: moderateScale(5), tintColor: AppColors.gray }}
                        resizeMode="cover"
                        showLoadingIndicator={true}
                      />
                      <Text style={styles.buttonText}>Tap to upload an image</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {errors.profilephoto && (
              <AppText
                styleText={{
                  paddingVertical: 5,
                  fontSize: moderateScale(12),
                  color: AppColors.red,
                  textAlign: 'left',
                }}
                viewStyle={{ width: DeviceDimentions.width / 1.22 }}
                children={errors.profilephoto}
              />
            )}
          </View>
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            value={formData.firstName}
            label={'First Name'}
            textContentType="name"
            onChangeText={text => handleInputChange('firstName', text)}
            required={true}
            error={errors.firstName}
          />
          <CustomTextInput
            value={formData.lastName}
            onChangeText={text => handleInputChange('lastName', text)}
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            label={'Last Name'}
            textContentType="name"
            required={true}
            error={errors.lastName}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.position}
            onChangeText={text => handleInputChange('position', text)}
            label={'Position'}
          // required={true}
          // error={errors.last_name}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('mobileNumber', text)}
            label={'Mobile Number'}
            textContentType="telephoneNumber"
            maxLength={12}
            keyboardType={'numeric'}
            required={true}
            error={errors.mobileNumber}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('businessName', text)}
            label={'Business Name'}
            required={true}
            error={errors.businessName}
          />


          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true), Keyboard.dismiss();
            }}
            // style={{height:moderateScale(40)}}
            activeOpacity={0.8}>
            <Text
              style={{
                color: AppColors.black,
                fontSize: moderateScale(FontSizes.small),
                paddingHorizontal: 5, paddingTop: 8, paddingBottom: 5

              }}>
              Business Sector
              <Text style={{ color: AppColors.red, fontSize: moderateScale(FontSizes.medium) }}> *</Text>
            </Text>
            <View
              style={[
                {
                  borderWidth: 1,
                  borderColor: '#ccc',
                  width: DeviceDimentions.width / 1.2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  alignItems: 'center',
                  borderRadius: 5,
                },
                styles.inputStyle,
              ]}>
              <Text
                style={{
                  color: AppColors.black,
                  fontSize: moderateScale(FontSizes.small),
                  textAlign: 'center',
                }}>
                {formData.businessSector.sector}
              </Text>
              <Ionicons
                name={'chevron-down'}
                color={AppColors.black}
                size={18}
              />
            </View>
            {errors.businessSector && (
              <AppText
                styleText={{
                  paddingVertical: 5,
                  fontSize: moderateScale(12),
                  color: AppColors.red,
                  textAlign: 'left',
                }}
                viewStyle={{ width: DeviceDimentions.width / 1.22 }}
                children={errors.businessSector}
              />
            )}
            {/* <CustomTextInput
              editable={false}
              value={formData.businessSector.sector}
              containerStyle={styles.inputContainer}
              textInputStyle={styles.inputStyle}
              onChangeText={text => handleInputChange('businessSector', text)}
              label={'Business Sector'}
              required={true}
              error={errors.businessSector}
            /> */}
          </TouchableOpacity>
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text =>
              handleInputChange('businessPhoneNumber', text)
            }
            label={'Business Phone Number'}
            required={true}
            maxLength={12}
            keyboardType={'numeric'}
            error={errors.businessPhoneNumber}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('businessWebsite', text)}
            label={'Business Website'}
            required={true}
            error={errors.businessWebsite}
          />
          <AppText
            viewStyle={{}}
            styleText={styles.text1}
            children={'Business Address'}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('addressLine1', text)}
            label={'1st Line'}
            required={true}
            error={errors.addressLine1}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('addressLine2', text)}
            label={'2nd Line'}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('townCity', text)}
            label={'Town/City'}

          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('country', text)}
            label={'Country'}
            textContentType={"countryName"}
            required={true}
            error={errors.country}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            autoCapitalize={'characters'}
            onChangeText={text => handleInputChange('postcode', text)}
            label={'Postcode'}
            required={true}
            error={errors.postcode}
          />
          <View style={styles.Checkbox}>
            <AppText
              viewStyle={{}}
              styleText={styles.disaplyText}
              children={"Display Address on Profile?"}
            />

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => onCheckpress("yes")}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>YES</Text>
                <Checkbox
                  status={check1 ? "checked" : "unchecked"}
                  color={AppColors.defaultColor}
                  uncheckedColor={AppColors.gray}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => onCheckpress("no")}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>NO</Text>
                <Checkbox
                  status={!check1 ? "checked" : "unchecked"}
                  color={AppColors.defaultColor}
                  uncheckedColor={AppColors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
          {!check1 && (
            <CustomTextInput
              textInputStyle={styles.inputStyle}
              value={formData.business_service_area}
              onChangeText={text =>
                handleInputChange('business_service_area', text)
              }
              label={'Service Area'}
              placeholder={'(i.e. Town`s/City`s)'}
              placeholderTextColor={AppColors.gray}
            />
          )}

          {/* <CustomTextInput
            value={formData.websiteAddress}
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('websiteAddress', text)}
            label={'Website Address'}
          /> */}
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('aboutYourself', text)}
            label={'Tell members about yourself and your business'}
            multiline={true}
            error={errors.aboutYourself}
            numberOfLines={4}
            textAlignVertical={'top'}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('networkHelp', text)}
            label={
              'How can the network help you?\nWhat are you and business looking for?'
            }
            multiline={true}
            error={errors.networkHelp}
            numberOfLines={4}
            textAlignVertical={'top'}
          />
          <View style={styles.container1}>
            <Text style={[styles.label, { color: AppColors.black, padding: 5 }]}>
              Upload your Business Logo
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.uploadButton]}
              onPress={() => {
                OnpressUploadLogo()
              }}>
              {/* {formData.bussinessLogo ? (
                                <CustomImage
                                    source={{ uri: formData.bussinessLogo }}
                                    placeholderSource={{ uri: formData.bussinessLogo }}
                                    style={styles.selectedBusinesslogo}
                                    resizeMode="cover"
                                    showLoadingIndicator={true}
                                />
                            ) : ( */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: DeviceDimentions.width / 1.3,

                }}>
                <View style={styles.uploadbussinesslogo}>
                  <Text style={styles.buttonText}>Choose file</Text>
                </View>
                <View
                  style={styles.uploadProfileConatainer}>
                  {/* <Text style={styles.buttonText}>
                    {formData.bussinessLogo.fileName
                      ? formData.bussinessLogo.fileName
                      : 'No file selected'}
                  </Text> */}
                  {formData.bussinessLogo.uri ? (
                    <CustomImage
                      source={{ uri: formData.bussinessLogo.uri }}
                      placeholderSource={{ uri: formData.bussinessLogo.uri }}
                      style={styles.profileimage}
                      resizeMode="cover"
                      showLoadingIndicator={true}
                    />
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <CustomImage
                        source={IMAGES.upload}
                        placeholderSource={IMAGES.upload}
                        style={{ width: moderateScale(30), height: moderateScale(30), marginTop: moderateScale(5), tintColor: AppColors.gray }}
                        resizeMode="cover"
                        showLoadingIndicator={true}
                      />
                      <Text style={styles.buttonText}>Tap to upload an image</Text>
                      {/* <Text style={styles.placeholder}>No file selected</Text> */}
                    </View>
                  )}
                </View>
                {/*  <Text style={styles.buttonText}>Tap to upload an image</Text> */}
                {/* <Text style={styles.placeholder}>No file selected</Text> */}
              </View>
              {/* )} */}
            </TouchableOpacity>

          </View>
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('cdh_whs_number', text)}
            label={'What is your CDH/WHS number?'}
            keyboardType={'numeric'}
            maxLength={2}
            error={errors.cdh_whs_number}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('linkedinUrl', text)}
            label={'Linkdin URL'}
          />
          <CustomTextInput
            containerStyle={styles.inputContainer}
            textInputStyle={styles.inputStyle}
            onChangeText={text => handleInputChange('facebookUrl', text)}
            label={'Facebook URL'}
          />

          {(returnMessage && !successMessage) && (
            <AppText
              styleText={{
                padding: 5,
                fontSize: moderateScale(12),
                color: AppColors.red,
                textAlign: 'left',
              }}
              viewStyle={{ width: DeviceDimentions.width / 1.22 }}
              children={returnMessage}
            />
          )}
          {successMessage && (
            <AppText
              styleText={{
                padding: 10,
                fontSize: moderateScale(12),
                color: AppColors.success,
                textAlign: 'left',
              }}
              viewStyle={{ width: DeviceDimentions.width / 1.22 }}
              children={successMessage}
            />
          )}
          <View style={{ width: '80%', alignItems: 'flex-start' }}>
            {apiError.map((item, index) => (
              <Text key={index} style={{ color: 'red', textAlign: 'left', padding: 5 }}>
                {item.message}
              </Text>
            ))}
          </View>
          <View style={styles.saveButtonConatiner}>
            {loader || successMessage ? (
              <ComponentLoader
                size="large"
                color={AppColors.defaultColor}
                style={styles.button}
              />
            ) : (
              <CustomButton
                title={'Finish'}
                onPress={() => {
                  handleSaveChanges();
                }}
                backgroundColor={'#2E3192'}
                containerStyle={styles.button}
                color={'#fff'}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FinishUpContaner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  container1: {
    padding: moderateScale(5),
  },
  inputContainer: {
    marginTop: moderateScale(2),
  },
  inputStyle: {
    height: moderateScale(40),
    color: AppColors.black,
  },
  uploadbussinesslogo: {
    backgroundColor: AppColors.gray1,
    height: '100%',
    alignSelf: 'flex-start',
    width: '30%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disaplyText: {
    color: AppColors.black,
    fontSize: moderateScale(12),
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  optionText: {
    color: AppColors.black,
    fontWeight: "500",
    fontSize: FontSizes.small,
    marginRight: 4,
  },
  saveButtonConatiner: {
    width: DeviceDimentions.width / 1.2,
    alignItems: 'center',
  },
  image: {
    width: scale(110),
    height: scale(110),
    tintColor: AppColors.borderColor,
  },
  selectedBusinesslogo: {
    width: scale(80),
    height: scale(80),
    borderRadius: 100,
  },
  text2: {
    padding: moderateScale(5),
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#2E3192',
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: AppColors.borderColor,
  },
  scrollViewContent: {
    //paddingBottom: moderateScale(100), // Ensure last input is not hidden
    alignItems: 'center',
  },
  text1: {
    alignSelf: 'flex-start',
    fontSize: moderateScale(16),
    // fontWeight: "700",
    color: AppColors.black,
    textAlign: 'left',
    width: DeviceDimentions.width / 1.2,
    paddingVertical: moderateScale(15),
    top: 20,
  },
  button: {
    width: scale(148),
    height: scale(45),
    marginVertical: moderateScale(20),
  },
  Checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(15),
    justifyContent: 'space-between',
    width: DeviceDimentions.width / 1.2,
  },
  label: {
    fontSize: 14,
    color: AppColors.defaultColor,
  },
  required: {
    color: AppColors.black,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: DeviceDimentions.width / 1.2,
    // minHeight: 50,
    // padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: '#000000',
    textAlign: 'center',
    paddingVertical: 15,
  },
  placeholder: {
    color: '#999',
    left: 20,
  },
  fileName: {
    color: '#555',
    left: 20,
  },
  profileimage: {
    width: scale(110),
    height: scale(110),
    borderRadius: 10,
    marginVertical: moderateScale(5),
    alignSelf: 'center'
  },
  editIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: AppColors.defaultColor,
  },
  editprofileconatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.defaultColor,
    marginTop: moderateScale(10),
  },
  requiredConatiner: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  uploadProfileConatainer: {
    height: '97%',
    alignSelf: 'flex-start',
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
