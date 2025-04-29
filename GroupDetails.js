import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, View, Text, TextInput, SafeAreaView, Alert, ScrollView, TouchableOpacity, FlatList, LogBox } from "react-native";
import { Image } from "react-native";
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from "../../../Components/CustomTextInput";
import AppText from "../../../Components/AppText";
import CustomButton from "../../../Components/CustomButton";
import { IMAGES } from "../../../assets/images/images";
import { AppColors, DeviceDimentions, FontSizes } from "../../../Utils/Constants";
import { HeaderTop } from "../../../Components/MainHeader/HeaderTop";
import CustomImage from "../../../Components/CustomImage";
import Path from "../../../services/Api";
import api from "../../../services/ApihelperModule";
import Loader from "../../../Components/Loader";
import { GlobalStyle } from "../../../Components/Styles/GlobalStyle";
import openURL, { openDialer, openGmail, openMaps } from "../../../Utils/CustomFunctions/CustomFunctions";

const GroupDetails = (params) => {

  const route = useRoute();
  const { group_id, group_name } = route.params;
  const group_Id = group_id != null || group_id != undefined ? group_id : null;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    getGroupsDetails(group_Id);
  }, [])

  const getGroupsDetails = (id) => {
    setLoading(true)
    api.getData(`${Path.group_Details}?group_id=${id}`).then((response) => {
      if (response.data != "" && response.data != null && response.data != undefined) {
        if (response.data.success) {
          console.log("response.data.data:", response.data.data);

          setData(response.data.data)
          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)

      }
    }).catch((err) => {
      setLoading(false)

    })
  }

  const {

    group_description,
    group_image, courseDetails,
    group_host,
    memberList,
    visitor_green_fee
  } = data;
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <>
      <View style={styles.memberItem}>
        {/* Profile Image */}
        {item && item.profile_photo ?
          <Image
            source={{ uri: item.profile_photo }}
            style={styles.profileImage}
          /> : <Image
            source={IMAGES.memberWhite}
            style={styles.profileImage}
          />}

        {/* Member Details */}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <View style={styles.memberSector}>
            <Image source={IMAGES.gsector} />
            <Text style={styles.sectorText}>{item.sector ? item.sector : '-'}</Text>
          </View>
        </View>

        {/* Score */}
        {item && item.cdh_whs_number && <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.cdh_whs_number}</Text>
        </View>}

        {/* Profile Button */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MemberProfile", { userId: item.id })
          }}
          style={GlobalStyle.profileButton}
        >
          <Text style={GlobalStyle.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1 }}>
        <Loader
          loader={loading}
        />
      </View>
      <HeaderTop title="Browse Groups" />
      {/* <Image source={{ uri: group_image }} style={styles.banner} /> */}
      <CustomImage
        source={{ uri: group_image }}
        placeholderSource={IMAGES.logo_blue}
        style={styles.banner}
        resizeMode="cover"
        showLoadingIndicator={true}
      />
      <View style={styles.container}>

        <View style={styles.groupnameConatiner}>
          <View style={styles.groupnameTextConatiner}>
            <Text style={styles.groupnameText}>{group_name}</Text>
          </View>
          <TouchableOpacity style={styles.iconConatiner}>
            <CustomImage
              source={IMAGES.profile}
              placeholderSource={IMAGES.profile}
              style={styles.groupiconP}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <CustomButton
            title={'Book a Visit'}
            onPress={() => {
              navigation.navigate("ViewDatesPage", {
                inviteflag: 2, group_Id: group_Id, group_image: group_image,
                visitor_green_fee: visitor_green_fee,
                group_namefrombrows: group_name, opening_hours: courseDetails[0].opening_hours, courseAddress: courseDetails[0].address
              })
            }}
            backgroundColor={"#2E3192"}
            containerStyle={styles.button}
            color={"#fff"}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About the Group</Text>
          <Text style={styles.descriptionText}>
            {group_description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Details</Text>
          <View style={styles.row}>
            <CustomImage
              source={IMAGES.MyVisits}
              placeholderSource={IMAGES.logo_blue}
              style={styles.AstburyImage}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
            <Text style={styles.sectionText}>{courseDetails && courseDetails[0].course_name}</Text>
          </View>
          <TouchableOpacity onPress={() => openMaps(courseDetails[0].address)}>
            <View style={styles.row}>
              <CustomImage
                source={IMAGES.location}
                placeholderSource={IMAGES.logo_blue}
                style={styles.AstburyImage}
                resizeMode="cover"
                showLoadingIndicator={true}
              />
              <Text style={styles.link}>
                {courseDetails && courseDetails[0].address}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.row}>
            <CustomImage
              source={IMAGES.time}
              placeholderSource={IMAGES.logo_blue}
              style={styles.AstburyImage}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
            <Text style={styles.sectionText}>{courseDetails && courseDetails[0].opening_hours}</Text>
          </View>
        </View>


        <View style={[styles.section, { ...styles.section1 }]}>
          <Text style={styles.sectionTitle}>Golf Club Contact</Text>
          <TouchableOpacity onPress={() => openURL(courseDetails[0].golf_contact.club_website)}>
            <View style={styles.row}>
              <CustomImage
                source={IMAGES.weblink}
                placeholderSource={IMAGES.logo_blue}
                style={styles.AstburyImage}
                resizeMode="cover"
                showLoadingIndicator={true}
              />
              <Text style={styles.link}>{courseDetails && courseDetails[0].golf_contact.club_website}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDialer(courseDetails[0].golf_contact.club_phone_number)}>
            <View style={styles.row}>
              <CustomImage
                source={IMAGES.phone}
                placeholderSource={IMAGES.logo_blue}
                style={styles.AstburyImage}
                resizeMode="cover"
                showLoadingIndicator={true}
              />
              <Text style={styles.link}>{courseDetails && courseDetails[0].golf_contact.club_phone_number}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* === GROUP HOST === */}

        {group_host != null ?
          <View style={styles.hostSection}>
            <Text style={styles.sectionTitle}>Group Host</Text>
            <View style={{ flexDirection: "row", paddingBottom: 10 }}>
              {group_host?.profile_photo ? <CustomImage
                source={{ uri: group_host?.profile_photo }}
                placeholderSource={IMAGES.logo_blue}
                style={styles.profileImage}
                resizeMode="cover"
                showLoadingIndicator={true}
              /> : <Image
                source={IMAGES.memberWhite}
                style={styles.profileImage}
              />}

              {/* Host Details */}
              <View>
                <View style={styles.hostHeader}>
                  <Text style={styles.hostName}>{group_host && group_host.name}</Text>
                  {group_host.cdh_whs_number &&
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{group_host && group_host.cdh_whs_number}</Text>
                    </View>
                  }
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', width: '80%' }}>
                  <View style={{ flexDirection: "column", left: 10 }}>
                    <Text style={styles.hostSubtitle}>{group_host && group_host.position}</Text>
                    <Text style={styles.hostSubtitle}>{group_host && group_host.business_name}</Text>
                  </View>

                  <View style={{ flexDirection: "column", left: moderateScale(25) }}>
                    <View style={styles.row}>
                      <CustomImage
                        source={IMAGES.sector}
                        placeholderSource={IMAGES.logo_blue}
                        style={styles.AstburyImage}
                        resizeMode="cover"
                        showLoadingIndicator={true}
                      />
                      <Text style={styles.hostSubtitle}>{group_host && group_host.sector}</Text>
                    </View>
                    <View style={styles.row}>
                      <CustomImage
                        source={IMAGES.location}
                        placeholderSource={IMAGES.logo_blue}
                        style={styles.AstburyImage}
                        resizeMode="cover"
                        showLoadingIndicator={true}
                      />
                      <Text style={styles.hostSubtitle}>Location</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <View>
                <TouchableOpacity onPress={() => openGmail(group_host.email)}>
                  <View style={styles.row}>
                    <CustomImage
                      source={IMAGES.email}
                      placeholderSource={IMAGES.logo_blue}
                      style={styles.AstburyImage}
                      resizeMode="cover"
                      showLoadingIndicator={true}
                    />
                    <Text style={[styles.link, { ...styles.link1 }]}>{group_host && group_host.email}</Text>
                  </View>
                </TouchableOpacity>

                {/* Phone */}
                <TouchableOpacity onPress={() => openDialer(group_host.phone_number)}>
                  <View style={styles.row}>
                    <CustomImage
                      source={IMAGES.phone}
                      placeholderSource={IMAGES.logo_blue}
                      style={styles.AstburyImage}
                      resizeMode="cover"
                      showLoadingIndicator={true}
                    />
                    <Text style={styles.link}>{group_host && group_host.phone_number}</Text>
                  </View>
                </TouchableOpacity>

              </View>
              <View>
                <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: AppColors.defaultColor, borderRadius: 10 }}>
                  <Text style={{ color: AppColors.white, fontSize: FontSizes.medium, padding: 14 }}>Message Group Host</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <View style={styles.hostSection}>
            <Text style={{ color: AppColors.black, fontSize: FontSizes.large, textAlign: 'left' }}>Group Host Not Assigned!</Text>
          </View>
        }


        <View style={styles.section3}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          <View style={{ marginBottom: moderateScale(50) }}>
            <FlatList
              data={memberList}
              // data={memberList.slice(0, 4)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              scrollEnabled={false}
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyGroupMemberDetailsPage", { group_name: group_name })
              }}
              style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>view all members</Text>
            </TouchableOpacity>
          </View>
        </View>



      </View>
    </ScrollView>
  );

};

export default GroupDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceDimentions.width - 25
    // width: DeviceDimentions.width - 50
    // padding:10
  },
  AstburyImage: {
    width: moderateScale(14),
    height: moderateScale(14),
  },
  groupnameConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
  },
  iconConatiner: {
    width: moderateScale(70),
    height: moderateScale(50),
    backgroundColor: AppColors.white,
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  groupnameTextConatiner: {
    backgroundColor: AppColors.white,
    height: moderateScale(50),
    justifyContent: 'center',
    flex: 1,
    marginRight: moderateScale(10),
    borderRadius: 10
  },
  groupnameText: {
    color: AppColors.black,
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(22),
    fontWeight: 'bold'

  },
  groupiconP: {
    width: moderateScale(32),
    height: moderateScale(32),
  },
  banner: {
    width: DeviceDimentions.width,
    height: 200
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: "space-between",
    // alignSelf:"center"

  },
  title: {
    backgroundColor: '#fff',
    textAlign: "center",
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    borderRadius: 5,
    padding: moderateScale(10)
  },
  avatar: {
    backgroundColor: '#fff',
    left: moderateScale(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
    height: moderateScale(50)
  },
  avatar1: {
    borderRadius: 5,
    backgroundColor: '#777777',
    width: moderateScale(60),
    height: moderateScale(42),
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    padding: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: 10
  },
  descriptionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  container1: {
    padding: 20,
  },

  scrollViewContent: {
    alignItems: "center",
    width: DeviceDimentions.width - 50,
    alignSelf: 'center'
  },
  section: {
    top: 10,
    padding: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: 10
  },
  section1: {
    top: 20,
  },
  section3: {
    top: 40,
    padding: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    fontWeight: "400"
  },
  link: {
    fontSize: 16,
    color: '#5081FF',
    // textDecorationLine: 'underline',
    fontWeight: "400",
    maxWidth: DeviceDimentions.width / 1.5,

  },
  link1: {
    fontSize: FontSizes.small,
    maxWidth: DeviceDimentions.width / 2.5
  },
  button: {
    width: DeviceDimentions.width - 50,
    height: scale(45),
  },
  button1: {


  },
  hostSection: {
    top: 30,
    padding: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: 10

  },

  profileImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: 5,
    backgroundColor: '#ddd',
    //bottom: moderateScale(10)
  },
  hostDetails: {
    // flex: 1,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 10,
    paddingBottom: 5
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  badge: {
    backgroundColor: AppColors.red,
    borderRadius: 100,
    width: 25,
    height: 25,
    alignItems: 'center', justifyContent: 'center'
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  hostSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  messageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  messageButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  viewAllButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: AppColors.gray,
    fontSize: moderateScale(14),
    fontWeight: '500',
    // textDecorationLine: 'underline',
  },

  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileImage1: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: 2,
    backgroundColor: AppColors.white,
    marginRight: moderateScale(10),
  },
  memberInfo: {
    flex: 1,
    paddingLeft: 15
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  memberSector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectorText: {
    fontSize: 12,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});