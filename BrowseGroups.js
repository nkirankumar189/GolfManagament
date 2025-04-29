import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderTop } from '../../../Components/MainHeader/HeaderTop'
import EspTextInput from '../../../Components/EspTextInput'
import { IMAGES } from '../../../assets/images/images'
import { AppColors, DeviceDimentions } from '../../../Utils/Constants'
import { moderateScale } from 'react-native-size-matters'
import CustomFlatList from '../../../Components/CustomFlatList'
import CustomImage from '../../../Components/CustomImage'
import AppText from '../../../Components/AppText'
import { useNavigation } from '@react-navigation/native'
import FilterPortal from '../../../Components/FilterPortal'
import FilterModal from '../../../Components/FilterModal'
import Path from '../../../services/Api'
import api from '../../../services/ApihelperModule'
import ComponentLoader from '../../../Components/ComponentLoader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../Redux/Slices/userSlice'

const BrowseGroups = () => {
    const navigation = useNavigation();
    const [filterVisible, setFilterVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const filterItems = ['Group', 'Sector', 'Location', 'Distance'];

    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const user = useSelector(selectUser);
    const { first_name, last_name, profile_photo, group_id, group_name, cdh_whs_number } = user || {};

    useEffect(() => {
        getAllGroupsData();
    }, [page])

    const getAllGroupsData = () => {
        if (page === 1) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        
        api.getData(`${Path.allGroups}&page=${page}`).then((response) => {
            if (response.data?.success) {
                // Filter out items with group_id === current user's group_id
                const filteredItems = response.data.data.filter(item => item.group_id !== group_id);
                
                if (page === 1) {
                    setData(filteredItems);
                    setFilteredData(filteredItems);
                } else {
                    setData(prevData => [...prevData, ...filteredItems]);
                    setFilteredData(prevData => [...prevData, ...filteredItems]);
                }
                
                // Check if we've reached the end of available data
                if (response.data.data.length === 0 || response.data.data.length < 10) { // Assuming 10 is your page size
                    setHasMoreData(false);
                } else {
                    setHasMoreData(true);
                }
            }
        }).catch((err) => {
            console.error("Error fetching data:", err);
        }).finally(() => {
            setLoading(false);
            setIsLoadingMore(false);
        });
    };

    const handleItemSelect = (item) => {
        setSelectedItem(item);
    };

    const filterData = (text) => {
        setSearchText(text);
        if (text.length > 0) {
            const newData = data.filter(item => {
                const itemData = item.group_name?.toUpperCase() || '';
                const textData = text?.toUpperCase();
                return itemData?.indexOf(textData) > -1;
            });
            setFilteredData(newData);
        } else {
            setFilteredData(data);
        }
    };

    const onItemPress = (item) => {
        navigation.navigate("GroupDetails", { group_id: item.group_id,group_name:item.group_name });
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => onItemPress(item)}
            activeOpacity={0.8}
            style={styles.item}>
            <CustomImage
                source={{ uri: item.group_image }}
                placeholderSource={IMAGES.logo_blue}
                style={styles.image}
                resizeMode="cover"
                showLoadingIndicator={true}
            />
            <View style={styles.detailsConatiner}>
                <AppText
                    styleText={styles.GroupName}
                    children={item.group_name}
                />
                <AppText
                    styleText={styles.GroupShortdesc}
                    children={item.course_name}
                />
                <AppText
                    styleText={styles.description}
                    children={item.group_description}
                    numberOfLines={1}
                />
            </View>
        </TouchableOpacity>
    );

    const loadMoreItems = () => {
        if (!isLoadingMore && hasMoreData) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        
        return (
            <View style={styles.loaderContainer}>
                <ComponentLoader
                    size="small"
                    color={AppColors.defaultColor}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderTop title="Browse Groups" />
            <FilterPortal
                heading="Filter by:"
                listItems={filterItems}
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                SelectedFillterItem={handleItemSelect}
            />
            <View style={styles.fillterMainConteiner}>
                <View style={styles.fillterConteiner}>
                    <EspTextInput
                        label=""
                        value={searchText}
                        onChangeText={filterData}
                        placeholder="Search groups"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        activeOpacity={0.8}>
                        <CustomImage
                            source={IMAGES.Filltericon}
                            placeholderSource={IMAGES.logo_blue}
                            style={styles.filltericonImage}
                            resizeMode="cover"
                            showLoadingIndicator={true}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.fullScreenLoader}>
                    <ComponentLoader
                        size="large"
                        color={AppColors.defaultColor}
                    />
                </View>
            ) : (
                <View style={{ height: DeviceDimentions.height / 1.25 }}>
                    <CustomFlatList
                        numColumns={2}
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.group_id.toString()}
                        emptyListMessage="No groups found!"
                        onEndReached={loadMoreItems}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                </View>
            )}
        </SafeAreaView>
    )
}

export default BrowseGroups

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    fillterMainConteiner: {
        backgroundColor: AppColors.defaultColor,
        width: DeviceDimentions.width
    },
    fillterConteiner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        margin: moderateScale(10),
        borderRadius: 10
    },
    input: {
        backgroundColor: AppColors.white,
        width: DeviceDimentions.width - moderateScale(65),
        margin: moderateScale(3),
        fontSize: moderateScale(14),
        height: moderateScale(40),
        paddingHorizontal: moderateScale(10)
    },
    filltericonImage: {
        width: 32, 
        height: 32, 
        resizeMode: 'contain'
    },
    item: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: DeviceDimentions.width / 2.2,
        height: DeviceDimentions.height / 4.2,
        margin: moderateScale(6),
        borderRadius: 15,
    },
    image: {
        width: DeviceDimentions.width / 2.2,
        height: (DeviceDimentions.height / 4.2) / 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    detailsConatiner: {
        height: (DeviceDimentions.height / 4.2) / 2,
        width: '95%',
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    GroupName: {
        color: AppColors.black,
        fontSize: moderateScale(16),
        fontWeight: '500'
    },
    GroupShortdesc: {
        color: AppColors.gray,
        fontSize: moderateScale(12),
        fontWeight: '500'
    },
    description: {
        color: AppColors.gray,
        fontSize: moderateScale(10),
    },
    loaderContainer: {
        padding: moderateScale(20),
    },
    fullScreenLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});