import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderTop } from '../../Components/MainHeader/HeaderTop';
import AppText from '../../Components/AppText';
import CustomImage from '../../Components/CustomImage';
import { IMAGES } from '../../assets/images/images';
import { moderateScale } from 'react-native-size-matters';
import { AppColors, DeviceDimentions } from '../../Utils/Constants';
import { useRoute } from '@react-navigation/native';
import Path from '../../services/Api';
import api from '../../services/ApihelperModule';
import Loader from '../../Components/Loader';
import { Linking } from 'react-native';
import { Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ComponentLoader from '../../Components/ComponentLoader';
import openURL, { openDialer, openGmail, openMaps } from '../../Utils/CustomFunctions/CustomFunctions';

const MemberProfile = (params) => {
    const route = useRoute();
    const { userId } = route.params;
    const [memberData, setMemberData] = useState({});
    const [loading, setLoading] = useState(false);

    const {
        profile_photo,
        group_name,
        first_name,
        last_name,
        position,
        phone_number,
        email,
        cdh_whs_number,
        linked_in_url,
        facebook_url,
        about_business,
        network_help,
        business_name,
        business_phone_number,
        website_address,
        business_sector,
        address_line_one,
        address_line_two,
        business_town_city,
        business_county,
        business_postcode,
        display_address,
        business_service_area,
        business_logo,
        status,
        joined_on
    } = memberData;

    useEffect(() => {
        getMemberDataList(userId);
    }, [])

    const getMemberDataList = () => {
        setLoading(true);
        api.getData(`${Path.memberData}?id=${userId}`).then((response) => {
            console.log("Profile Repsonse...............!",response);
            
            if (response.data != "" && response.data != null && response.data != undefined) {
                if (response.data.success) {
                    const res = response.data.memberData;
                    setMemberData(res);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);

            }
        }).catch((err) => {
            setLoading(false);

        })
    }

    const handlePress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Can't open this URL: ${url}`);
        }
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
      }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderTop title="Member Details" />
            {loading ?
                <View style={styles.loaderContainer}>
                    <ComponentLoader
                        size="large"
                        color={AppColors.defaultColor}
                        style={{}}
                    />
                </View>
                :
                <ScrollView style={{ flex: 1, paddingBottom: 10, }}>
                    {/* <Loader
            loader={loading}
        /> */}
                    <View style={styles.DetailsConatiner}>
                        <View style={{}}>
                            {cdh_whs_number &&
                                <View style={styles.batch}>
                                    <AppText styleText={styles.batchtext} children={cdh_whs_number} />
                                </View>
                            }
                            {profile_photo ?
                                <CustomImage
                                    source={{ uri: profile_photo }}
                                    placeholderSource={IMAGES.logo_blue}
                                    style={styles.image}
                                    resizeMode="cover"
                                    showLoadingIndicator={true}
                                /> : <Image
                                    source={IMAGES.memberWhite}
                                    style={styles.profileImage1}
                                />}

                        </View>
                        <AppText
                            styleText={styles.text}
                            children={first_name}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {position &&
                                <AppText
                                    styleText={[styles.sectortext, { maxWidth: DeviceDimentions.width / 2.4 }]}
                                    children={`${position != undefined ? position : ""}`}
                                />
                            }
                            {business_name &&
                                <AppText
                                    styleText={[styles.sectortext, { maxWidth: DeviceDimentions.width / 2.4 }]}
                                    children={`,${business_name != undefined ? business_name : ""}`}
                                />
                            }
                        </View>
                        <View style={styles.sectorContainer}>
                            {business_sector && <View style={{ flexDirection: 'row' }}>
                                <Image source={IMAGES.sector} style={styles.sector} />
                                <AppText
                                    styleText={styles.sectortext}
                                    children={business_sector}
                                />
                            </View>}
                            {address_line_one && <View style={{ flexDirection: 'row', marginLeft: 10, maxWidth: DeviceDimentions.width / 1.8, alignItems: 'center' }}>
                                <Image source={IMAGES.location} style={styles.sector} />
                                <AppText
                                    //numberOfLines={1}
                                    styleText={styles.sectortext}
                                    children={business_town_city}//${address_line_two}business_town_city
                                    // children={address_line_one + address_line_two + business_town_city + business_county + business_postcode}//${address_line_two}business_town_city
                                />
                            </View>}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 18 }}>
                            <Image source={IMAGES.Groups} style={styles.sector} />
                            <AppText
                                styleText={styles.sectortext}
                                children={group_name}
                            />
                        </View>
                    </View>
                    {/* Buttons */}
                    <View style={styles.buttonsConater}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.MessageButton}>
                            <AppText
                                styleText={styles.MessageButtontxt}
                                children={"Message"}
                            />
                        </TouchableOpacity>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between',
                            marginHorizontal: 10
                        }}>
                            <TouchableOpacity style={{}} onPress={() => openURL(linked_in_url)} activeOpacity={0.8} >
                                <AntDesign name="linkedin-square" color={AppColors.in} size={53} style={styles.socialImages} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openURL(facebook_url)} activeOpacity={0.8} >
                                <AntDesign name="facebook-square" color={AppColors.fb} size={53} style={styles.socialImages} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={styles.Sharebutton}>
                                <CustomImage
                                    source={IMAGES.share}
                                    placeholderSource={IMAGES.share}
                                    style={[styles.socialImages, {
                                        width: DeviceDimentions.width / 20,
                                        height: DeviceDimentions.width / 20, borderRadius: 0
                                    }]}
                                    resizeMode="cover"
                                    showLoadingIndicator={true}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Membership Details */}
                    <View style={styles.detailsConatiner}>
                        <View style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Membership No:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={""}
                            />
                        </View>
                        <View style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Join Date:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={joined_on && formatDate(joined_on)}
                            />
                        </View>
                    </View>
                    {/* Contact Details */}
                    <View style={styles.detailsConatiner}>
                        <AppText
                            styleText={styles.HeaderText}
                            children={"Contact Details"}
                        />
                        <TouchableOpacity onPress={() => openGmail(email)} style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Email Address:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={email}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openDialer(phone_number)} style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Phone Number:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={phone_number}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* What I’m Looking For */}
                    <View style={styles.detailsConatiner}>
                        <AppText
                            styleText={styles.HeaderText}
                            children={"What I’m Looking For"}
                        />
                        <View style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={network_help}
                            />
                        </View>
                    </View>
                    {/* What I’m Looking For */}
                    <View style={styles.detailsConatiner}>
                        <AppText
                            styleText={styles.HeaderText}
                            children={"About Me"}
                        />
                        <View style={styles.dataItemConatiner}>
                            <AppText
                                styleText={styles.subtext}
                                children={about_business}
                            />
                        </View>
                    </View>
                    {/* Business Information */}
                    <View style={styles.detailsConatiner}>
                        <AppText
                            styleText={styles.HeaderText}
                            children={"Business Information"}
                        />
                        <CustomImage
                            source={{ uri: business_logo }}
                            placeholderSource={IMAGES.P_Logo}
                            style={styles.image1}
                            resizeMode="contain"
                            showLoadingIndicator={true}
                        />
                        <View style={[styles.dataItemConatiner, { flexDirection: 'column', marginTop: 10 }]}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Business Name: "}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={business_name}
                            />
                        </View>
                        <View style={[styles.dataItemConatiner, { flexDirection: 'column', top: 10 }]}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Business Sector:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={business_sector}
                            />
                        </View>
                        <TouchableOpacity onPress={() => openDialer(business_phone_number)} style={[styles.dataItemConatiner, { flexDirection: 'column', top: 10 }]}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Business Phone Number:"}
                            />
                            <AppText
                                styleText={styles.subtextValue}
                                children={business_phone_number}
                            />
                        </TouchableOpacity>
                        <View style={[styles.dataItemConatiner, { flexDirection: 'column', marginTop: 15, width: DeviceDimentions.width / 1.1 }]}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Business Address:"}
                            />
                            <TouchableOpacity onPress={() => openMaps(`${address_line_one}, ${address_line_two}`)}
                                style={{ alignItems: 'center', minHeight: moderateScale(15) }}>
                                {address_line_one &&
                                    <AppText
                                        styleText={styles.subtextValue}
                                        children={`${address_line_one},`}
                                    />
                                }
                                {address_line_two &&
                                    <AppText
                                        styleText={styles.subtextValue}
                                        children={address_line_two}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.dataItemConatiner, { flexDirection: 'column', marginTop: 10 }]}>
                            <AppText
                                styleText={styles.subtext}
                                children={"Website:"}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    handlePress(website_address)
                                }}
                            >
                                <AppText
                                    styleText={[styles.subtextValue, { color: '#5081FF' }]}
                                    children={website_address}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
}

export default MemberProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        bottom: 10,

    },
    loaderContainer: {
        flex: 1,
        height: DeviceDimentions.height / 1.1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    DetailsConatiner: {
        backgroundColor: AppColors.white,
        width: DeviceDimentions.width - 30,
        margin: moderateScale(10),
        alignItems: 'center',
        borderRadius: 15,
        alignSelf: 'center'
        //padding: moderateScale(10)
    },
    subtext: {
        fontSize: moderateScale(12),
        fontWeight: "500",
        color: "#777777",
        textAlign: 'left',
        paddingRight: moderateScale(5),
    },
    subtextValue: {
        fontSize: moderateScale(12),
        fontWeight: "500",
        color: "#000",
        textAlign: 'left',
    },
    image: {
        width: DeviceDimentions.width / 3,
        height: DeviceDimentions.width / 3,
        borderRadius: 12,
        marginTop: 10
    },
    image1: {
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: 20,
        marginTop: 5,
        // margin:10
    },
    profileImage1: {
        width: DeviceDimentions.width / 3,
        height: DeviceDimentions.width / 3,
        borderRadius: 12,
        backgroundColor: '#ddd',
    },
    socialImages: {
        // width: DeviceDimentions.width / 8.3,
        // height: DeviceDimentions.width / 8.3,
        // borderRadius: 16,

    },
    imageContainer: {
        margin: moderateScale(30)
    },
    text: {
        padding: moderateScale(5),
        fontSize: moderateScale(22),
        fontWeight: "700",
        color: "#000000",
    },
    batch: {
        backgroundColor: 'red',
        width: 30, height: 30,
        borderRadius: 100,
        position: 'absolute',
        alignSelf: 'flex-end',
        zIndex: 10,
        top: 25,
        right: 5,
        alignItems: 'center', justifyContent: 'center'
    },
    batchtext: {
        fontSize: moderateScale(12),
        color: AppColors.white,
        fontWeight: '500'
    },
    sector: {
        width: moderateScale(18),
        height: moderateScale(18),
    },
    sectortext: {
        color: '#000',
        paddingLeft: 5,
        fontSize: moderateScale(14),
        textAlign: 'left'
    },
    sectorContainer: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsConater: {
        flexDirection: 'row',
        height: moderateScale(45),
        alignItems: 'center',
        width: DeviceDimentions.width - 30,
        alignSelf: 'center'
    },
    MessageButton: {
        backgroundColor: AppColors.defaultColor,
        borderRadius: moderateScale(10),
        height: '100%',
        justifyContent: 'center',
        width: DeviceDimentions.width / 2,
        marginRight: moderateScale(5)
    },
    MessageButtontxt: {
        color: AppColors.white,
        fontWeight: '500',
        fontSize: moderateScale(14),
        textAlign: 'center',
    },
    Sharebutton: {
        backgroundColor: '#777777', borderRadius: 5, width: DeviceDimentions.width / 10,
        height: DeviceDimentions.width / 10, alignItems: 'center', justifyContent: 'center'
    },
    detailsConatiner: {
        backgroundColor: AppColors.white,
        width: DeviceDimentions.width - 30,
        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(10),
        alignItems: 'flex-start',
        borderRadius: 15,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(15),
    },
    dataItemConatiner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5
    },
    HeaderText: {
        color: AppColors.black,
        fontWeight: '500',
        fontSize: moderateScale(16)
    }
})