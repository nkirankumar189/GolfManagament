import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import CustomTextInput from '../../../Components/CustomTextInput';
import AppText from '../../../Components/AppText';
import { IMAGES } from '../../../assets/images/images';
import { scale, moderateScale } from 'react-native-size-matters';
import CustomButton from '../../../Components/CustomButton';
import { HeaderTop } from '../../../Components/MainHeader/HeaderTop';
import { AppColors, DeviceDimentions, FontSizes } from '../../../Utils/Constants';
import CustomImage from '../../../Components/CustomImage';
import {
  getStorageItem,
  pickImage,
} from '../../../Utils/CustomFunctions/CustomFunctions';
import ApihelperModule from '../../../services/ApihelperModule';
import Path from '../../../services/Api';
import ComponentLoader from '../../../Components/ComponentLoader';
import SectorsPostal from '../../../Components/SectorsPortal';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';

const ProfileEdit = () => {
  const route = useRoute();
  const [returnMessage, setReturnMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [businessSectorData, setBusinessSectorData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiError, setApiError] = useState([]);

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
    business_service_area,
    website_address,
    about_business,
    network_help,
    business_logo,
    linked_in_url,
    facebook_url,
    position,
    sector_id,
    cdh_whs_number,
  } = route.params?.profileData;

  const [check1, setCheck1] = useState(true);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  // State for form fields
  const [formData, setFormData] = useState({
    first_name: first_name,
    last_name: last_name,
    phone_number: phone_number,
    business_name: business_name,
    business_sector: { sector: business_sector, id: sector_id },
    business_phone_number: business_phone_number,
    businessWebsite: '',
    address_line_one: address_line_one,
    address_line_two: address_line_two,
    business_town_city: business_town_city,
    business_county: business_county,
    business_postcode: business_postcode,
    website_address: website_address,
    about_business: about_business,
    network_help: network_help,
    businesslogo: { uri: business_logo, type: '', name: '' },
    profilephoto: { uri: profile_photo, type: '', name: '' },
    cdh_whs_number: cdh_whs_number,
    linked_in_url: linked_in_url,
    facebook_url: facebook_url,
    business_service_area: business_service_area,
    position: position,
    email: email,
    group_name: group_name,
  });
  // State for validation errors
  const [errors, setErrors] = useState({});
  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    function validateNumber(value) {
      const num = Number(value);
      return String(value).length <= 2 && !isNaN(num) && num <= 99 && num >= 0;
    }
    // Clear error for the field when user starts typing
    if (field == 'cdh_whs_number') {
      if (!validateNumber(value)) {
        setErrors({
          ...errors,
          [field]: 'CDH/WHS number should be less then 99.',
        });
      }
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Helper to check if a value is null, undefined, or an empty string after trimming
    const isEmpty = (value) =>
      value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

    if (isEmpty(formData.first_name))
      newErrors.first_name = 'First Name is required';

    if (isEmpty(formData.last_name))
      newErrors.last_name = 'Last Name is required';

    if (isEmpty(formData.phone_number))
      newErrors.phone_number = 'Mobile Number is required';

    if (isEmpty(formData.business_name))
      newErrors.business_name = 'Business Name is required';

    if (
      !formData.business_sector ||
      !formData.business_sector.sector ||
      isEmpty(formData.business_sector.sector)
    )
      newErrors.business_sector = 'Business Sector is required';

    if (isEmpty(formData.business_phone_number))
      newErrors.business_phone_number = 'Business Phone Number is required';

    if (isEmpty(formData.business_town_city))
      newErrors.business_town_city = 'Town/City is required';

    if (isEmpty(formData.business_postcode))
      newErrors.business_postcode = 'Postcode is required';

    if (
      errors.cdh_whs_number !== '' &&
      errors.cdh_whs_number !== undefined
    ) {
      newErrors.cdh_whs_number = 'CDH/WHS number should be less than 99.';
    }

    // Business website validation (example: URL format)
    if (
      formData.businessWebsite &&
      !/^\S+\.\S+$/.test(formData.businessWebsite)
    ) {
      newErrors.businessWebsite = 'Invalid Website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Handle form submission
  const handleSaveChanges = () => {
    Keyboard.dismiss()
    if (validateForm()) {
      UpdateProfile();
    } else {
      setReturnMessage('⚠️ Oops! Please check your form.');
    }
  };



  const UpdateProfile = async () => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;
    let retryCount = 0;
    setLoader(true);
    setReturnMessage('');
    setApiError([]);

    // Get user token
    let userToken;
    try {
      userToken = await getStorageItem('userToken');
    } catch (error) {
      console.error('Error getting user token:', error);
      setLoader(false);
      setReturnMessage('Failed to retrieve user token');
      return;
    }

    // Prepare form data
    const formDataToSend = new FormData();

    // Append all text fields
    const textFields = {
      user_id: user_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      position: formData.position,
      phone_number: formData.phone_number,
      cwhs_number: formData.cdh_whs_number,
      linkedin_url: formData.linked_in_url,
      facebook_url: formData.facebook_url,
      about_your_business: formData.about_business,
      how_can_network_help_you_and_business: formData.network_help,
      business_name: formData.business_name,
      business_phone_number: formData.business_phone_number,
      website_address: formData.website_address,
      business_address_line_one: formData.address_line_one,
      business_address_line_two: formData.address_line_two,
      business_town_city: formData.business_town_city,
      business_county: formData.business_county,
      business_postcode: formData.business_postcode,
      display_address_on_profile: check1 ? '1' : '0',
      business_service_area: formData.business_service_area,
    };

    Object.entries(textFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    // Append business sector if exists
    if (formData.business_sector?.id !== undefined) {
      formDataToSend.append('sector_id', formData.business_sector.id);
    }

    // Append files if they exist
    if (formData.businesslogo?.type) {
      formDataToSend.append('business_logo', {
        uri: formData.businesslogo.uri,
        type: formData.businesslogo.type,
        name: formData.businesslogo.fileName || 'business_logo.jpg',
      });
    }

    if (formData.profilephoto?.type) {
      formDataToSend.append('profile_photo', {
        uri: formData.profilephoto.uri,
        type: formData.profilephoto.type,
        name: formData.profilephoto.fileName || 'profile_photo.jpg',
      });
    }

    // Configure axios instance
    const axiosInstance = axios.create({
      baseURL: Path.BaseUrl,
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Add retry logic
    axiosInstance.interceptors.response.use(null, async (error) => {
      const config = error.config;

      if (error.response?.status >= 500 && retryCount < MAX_RETRIES) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retryCount));
        return axiosInstance(config);
      }

      return Promise.reject(error);
    });

    try {
      const response = await axiosInstance.post(Path.createMember, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("response:", response);

      if (response.data?.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage('');
          navigation.goBack('Profile');
        }, 100);
      } else {
        setLoader(false);
        if (response.data?.errors) {
          setApiError(response.data.errors);
        } else {
          setReturnMessage(response.data?.message || 'Update failed');
        }
      }
    } catch (error) {
      setLoader(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside 2xx
          console.error('API Error:', error.response.status, error.response.data);
          if (error.response.data?.errors) {
            setApiError(error.response.data.errors);
          } else {
            setReturnMessage(error.response.data?.message || 'Request failed');
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network Error:', error.request);
          setReturnMessage('Network error - please check your connection');
        } else {
          // Something happened in setting up the request
          console.error('Request Setup Error:', error.message);
          setReturnMessage('Request setup error');
        }
      } else {
        // Non-Axios error
        console.error('Unexpected Error:', error);
        setReturnMessage('An unexpected error occurred');
      }
    } finally {
      setLoader(false);
    }
  };


  const OnpressUploadLogo = async () => {
    try {
      const image = await pickImage();
      if (image) {
        setFormData({
          ...formData, // Spread the existing state
          businesslogo: image, // Update business_logo with the new image URI
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
  const OnpressEditprofile = async () => {
    try {
      const image = await pickImage();
      if (image) {
        setFormData({
          ...formData, // Spread the existing state
          profilephoto: image, // Update business_logo with the new image URI
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

  useEffect(() => {
    setCheck1(display_address);
    getBusinessSector();
  }, []);
  const getBusinessSector = async () => {
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

  const handleItemSelect = item => {
    // setSelectedItem(item);
    setFormData({
      ...formData, // Spread the existing state
      business_sector: item, // Update bussinessLogo with the new image URI
    });
    setErrors({
      ...errors,
      business_sector: '',
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
      style={{ flex: 1, backgroundColor: AppColors.white }}>
      <HeaderTop title="My Profile" />
      <SectorsPostal
        heading="Business Sector"
        listItems={businessSectorData}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        SelectedFillterItem={handleItemSelect}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => OnpressEditprofile()}
            activeOpacity={0.8}>
            <CustomImage
              source={{ uri: formData.profilephoto.uri }}
              placeholderSource={IMAGES.headerLogo}
              style={styles.profileimage}
              resizeMode="cover"
              showLoadingIndicator={true}
            //opacity={0.5}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => OnpressEditprofile()}
            activeOpacity={0.8}
            style={styles.editprofileconatiner}>
            <CustomImage
              source={IMAGES.edit}
              placeholderSource={IMAGES.edit}
              style={styles.editIcon}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
            <Text
              style={styles.EditPrifileText}>
              Edit Profile Photo
            </Text>
          </TouchableOpacity>
          <View style={styles.requiredConatiner}>
            <Text style={[styles.required, { color: AppColors.red }]}>*</Text>
            <Text style={styles.required}>indicates required</Text>
          </View>
          <AppText
            viewStyle={{}}
            styleText={styles.text1}
            children={'Member Details'}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.first_name}
            containerStyle={styles.inputConatiner}
            label={'First Name'}
            onChangeText={text => handleInputChange('first_name', text)}
            required={true}
            error={errors.first_name}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.last_name}
            onChangeText={text => handleInputChange('last_name', text)}
            containerStyle={styles.inputConatiner}
            label={'Last Name'}
            required={true}
            error={errors.last_name}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.position}
            onChangeText={text => handleInputChange('position', text)}
            containerStyle={styles.inputConatiner}
            label={'Position'}
            // required={true}
            error={errors.last_name}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.phone_number}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('phone_number', text)}
            label={'Mobile Phone Number'}
            // maxLength={12}
            keyboardType={'numeric'}
            required={true}
            error={errors.phone_number}
          />
          <CustomTextInput
            editable={false}
            textInputStyle={styles.inputStyle}
            value={formData.email}
            containerStyle={styles.inputConatiner}
            // onChangeText={text => handleInputChange('phone_number', text)}
            label={'Email'}
          // maxLength={12}
          // keyboardType={'numeric'}
          // required={true}
          // error={errors.phone_number}
          />
          <CustomTextInput
            editable={false}
            textInputStyle={styles.inputStyle}
            value={formData.group_name}
            containerStyle={styles.inputConatiner}
            // onChangeText={text => handleInputChange('phone_number', text)}
            label={'Group'}
          // maxLength={12}
          // keyboardType={'numeric'}
          // required={true}
          // error={errors.phone_number}
          />
          <AppText
            viewStyle={{}}
            styleText={styles.text1}
            children={'Business Details'}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.business_name}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('business_name', text)}
            label={'Business Name'}
            required={true}
            error={errors.business_name}
          />
          {/* <TouchableOpacity
                        onPress={() => {
                            setIsModalVisible(true), Keyboard.dismiss();
                        }}
                        activeOpacity={0.8}>
                        <CustomTextInput
                            editable={false}
                            textInputStyle={styles.inputStyle}
                            value={formData.business_sector.sector}
                            containerStyle={styles.inputConatiner}
                            onChangeText={text => handleInputChange('business_sector', text)}
                            label={'Business Sector'}
                            required={true}
                            error={errors.business_sector}
                        />
                    </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true), Keyboard.dismiss();
            }}
            style={{ height: moderateScale(60), marginBottom: moderateScale(15) }}
            activeOpacity={0.8}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: AppColors.black,
                  fontSize: moderateScale(FontSizes.small),
                  paddingHorizontal: 5,
                  paddingTop: 8,
                  paddingBottom: 5,
                  fontWeight: '500',
                }}>
                Business Sector
              </Text>
              <Text
                style={{
                  color: AppColors.red,
                  fontSize: moderateScale(FontSizes.medium),
                  paddingTop: 8,
                  paddingBottom: 5,
                  fontWeight: '500',
                }}>
                *
              </Text>
            </View>
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
                {formData.business_sector.sector}
              </Text>
              <Ionicons
                name={'chevron-down'}
                color={AppColors.black}
                size={18}
              />
            </View>
          </TouchableOpacity>
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.business_phone_number}
            containerStyle={styles.inputConatiner}
            onChangeText={text =>
              handleInputChange('business_phone_number', text)
            }
            label={'Business Phone Number'}
            required={true}
            // maxLength={12}
            keyboardType={'numeric'}
            error={errors.business_phone_number}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.website_address}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('website_address', text)}
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
            textInputStyle={styles.inputStyle}
            value={formData.address_line_one}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('address_line_one', text)}
            label={'1st Line'}
            minHeight={50}
            multiline
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.address_line_two}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('address_line_two', text)}
            label={'2nd Line'}
            multiline
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.business_town_city}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('business_town_city', text)}
            label={'Town/City'}
            required={true}
            error={errors.business_town_city}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.business_county}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('business_county', text)}
            label={'Country'}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.business_postcode}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('business_postcode', text)}
            label={'Postcode'}
            required={true}
            error={errors.business_postcode}
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
              containerStyle={styles.inputConatiner}
              onChangeText={text =>
                handleInputChange('business_service_area', text)
              }
              label={'Service Area'}
              placeholder={'(i.e. Town`s/City`s)'}
              placeholderTextColor={AppColors.gray}
            />
          )}

          {/* <CustomTextInput
                        textInputStyle={styles.inputStyle}
                        value={formData.website_address}
                        containerStyle={styles.inputConatiner}
                        onChangeText={text => handleInputChange('website_address', text)}
                        label={'Website Address'}
                    /> */}
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.about_business}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('about_business', text)}
            label={'Tell members about yourself and your business'}
            multiline={true}
            error={errors.about_business}
            numberOfLines={4}
          // textAlignVertical={"top"}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.network_help}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('network_help', text)}
            label={
              'How can the network help you?\nWhat are you and business looking for?'
            }
            maxLength={255}
            multiline={true}
            error={errors.network_help}
            numberOfLines={4}
          // textAlignVertical={"top"}
          />
          <View style={styles.container1}>
            <Text style={[styles.label, { color: AppColors.black }]}>
              Upload your Business Logo
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton]}
              onPress={() => {
                OnpressUploadLogo();
              }}>
              {formData.businesslogo.uri ? (
                <CustomImage
                  source={{ uri: formData.businesslogo.uri }}
                  placeholderSource={{ uri: formData.businesslogo.uri }}
                  style={styles.profileimage}
                  resizeMode="cover"
                  showLoadingIndicator={true}
                />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <CustomImage
                    source={IMAGES.upload}
                    placeholderSource={IMAGES.upload}
                    style={[styles.profileimage, {
                      width: moderateScale(50),
                      height: moderateScale(50)
                    }]}
                    resizeMode="cover"
                    showLoadingIndicator={true}
                  />
                  <Text style={styles.buttonText}>Tap to upload an image</Text>
                  {/* <Text style={styles.placeholder}>No file selected</Text> */}
                </View>
              )}
            </TouchableOpacity>
          </View>
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.cdh_whs_number}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('cdh_whs_number', text)}
            label={'What is your CDH/WHS number?'}
            keyboardType={'numeric'}
            maxLength={2}
            error={errors.cdh_whs_number}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.linked_in_url}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('linked_in_url', text)}
            label={'Linkdin URL'}
          />
          <CustomTextInput
            textInputStyle={styles.inputStyle}
            value={formData.facebook_url}
            containerStyle={styles.inputConatiner}
            onChangeText={text => handleInputChange('facebook_url', text)}
            label={'Facebook URL'}
          />
          <View style={{ width: DeviceDimentions.width / 1.2, alignItems: 'flex-start' }}>
            {apiError?.map((item, index) => (
              <Text key={index} style={{ color: 'red', textAlign: 'left', padding: 5 }}>
                {item.message}
              </Text>
            ))}
          </View>
          {successMessage && (
            <AppText
              styleText={{
                padding: 5,
                fontSize: moderateScale(12),
                color: AppColors.success,
                textAlign: 'left',
              }}
              viewStyle={{ width: DeviceDimentions.width / 1.22 }}
              children={successMessage}
            />
          )}
          <View style={styles.saveButtonConatiner}>
            {loader || successMessage ? (
              <ComponentLoader
                size="large"
                color={AppColors.defaultColor}
                style={styles.button}
              />
            ) : (
              <CustomButton
                title={'Save changes'}
                onPress={() => {
                  handleSaveChanges();
                }}
                backgroundColor={'#2E3192'}
                containerStyle={styles.button}
                color={'#fff'}
              // disabled={loader}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    marginTop: moderateScale(50),
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  container1: {
    padding: 20,
  },
  inputConatiner: {
    marginTop: moderateScale(5),
  },
  inputStyle: {
    color: AppColors.gray,
    minHeight: moderateScale(50),
    maxHeight: moderateScale(100),
    flex: 1,
    fontSize: moderateScale(FontSizes.small),
  },
  disaplyText: {
    color: AppColors.black,
    fontSize: moderateScale(FontSizes.small),
    fontWeight: '500'
  },
  saveButtonConatiner: {
    width: DeviceDimentions.width / 1.2,
    alignItems: 'flex-end',
  },
  image: {
    width: scale(40),
    height: scale(40),
    tintColor: AppColors.borderColor,
  },
  selectedBusinesslogo: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(5),
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(FontSizes.large),
    fontWeight: '700',
    color: AppColors.borderColor,
  },
  scrollViewContent: {
    paddingBottom: moderateScale(100), // Ensure last input is not hidden
    alignItems: 'center',
  },
  text1: {
    alignSelf: 'flex-start',
    fontSize: moderateScale(FontSizes.medium),
    color: AppColors.black,
    textAlign: 'left',
    width: DeviceDimentions.width / 1.2,
    marginTop: moderateScale(20),
    marginBottom: moderateScale(-5),
    fontWeight: '500',
  },
  button: {
    width: scale(148),
    height: scale(45),
    marginTop: moderateScale(30),
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
  Checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(15),
    justifyContent: 'space-between',
    width: DeviceDimentions.width / 1.2,
  },
  label: {
    fontSize: moderateScale(FontSizes.small),
    color: AppColors.defaultColor,
    paddingBottom: 5,
    fontWeight: '500',
  },
  required: {
    color: AppColors.black,
    textAlign: 'center',
    paddingHorizontal: 2,
    fontSize: moderateScale(FontSizes.small),
    fontWeight: '500',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: DeviceDimentions.width / 1.2,
    minHeight: DeviceDimentions.width / 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: '#777777',
    fontSize: moderateScale(FontSizes.small),
    fontWeight: '500',
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
    width: scale(100),
    height: scale(100),
    borderRadius: 16,
  },
  editIcon: {
    width: scale(12),
    height: scale(12),
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
    marginRight: 15,
  },
  EditPrifileText: {
    paddingLeft: 10,
    textAlignVertical: 'center',
    color: AppColors.defaultColor,
    fontWeight: '500',
    fontSize: moderateScale(FontSizes.small)
  }
});
