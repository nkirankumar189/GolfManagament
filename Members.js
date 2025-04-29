import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, SectionList } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { HeaderTop } from '../../Components/MainHeader/HeaderTop'
import { AppColors, DeviceDimentions, FontSizes } from '../../Utils/Constants'
import EspTextInput from '../../Components/EspTextInput'
import { IMAGES } from '../../assets/images/images'
import { moderateScale } from 'react-native-size-matters'
import FilterPortal from '../../Components/FilterPortal'
import { useNavigation } from '@react-navigation/native'
import CustomImage from '../../Components/CustomImage'
import Path from '../../services/Api'
import api from '../../services/ApihelperModule'
import ComponentLoader from '../../Components/ComponentLoader'
import AppText from '../../Components/AppText'

const Members = () => {
  const navigation = useNavigation();
  const filterItems = ['Group', 'Sector', 'Location', 'Distance'];
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allMembers, setAllMembers] = useState([]); // Store all members for search

  useEffect(() => {
    getAllMembersList(1, true);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const SelectedFillterItem = (data) => {
    console.log("data;", data);
  }

  const getAllMembersList = async (pageNum, reset = false) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await api.getData(`${Path.allMembers}?per_page=5&page=${pageNum}`);
      console.log("response............................:", response);

      if (response?.data?.success) {
        const newMembers = response.data.members || [];
        const updatedMembers = reset
          ? newMembers
          : Array.from(new Map([...data, ...newMembers].map(member => [member.id, member])).values());

        setData(updatedMembers);
        setAllMembers(updatedMembers); // Store all members for search
        filterMembersByName(searchText, updatedMembers);
        setPage(pageNum);
        setHasMore(newMembers.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembersByName = (text, members = allMembers) => {
    setSearchText(text);
    if (text === '') {
      // If search text is empty, show all members
      const sectionedData = formatToSectionedList(members);
      setFilteredData(sectionedData);
    } else {
      // Filter members whose name includes the search text (case insensitive)
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(text.toLowerCase())
      );
      const sectionedData = formatToSectionedList(filtered);
      setFilteredData(sectionedData);
    }
  };

  const formatToSectionedList = (members) => {
    // Group members by the first letter of their name
    const grouped = members.reduce((acc, member) => {
      const firstLetter = member?.name[0]?.toUpperCase() || ''; // Get first letter
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(member);
      return acc;
    }, {});

    // Convert to section list format & sort alphabetically
    return Object.keys(grouped)
      .sort() // Sort alphabetically
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));
  };

  const loadMoreItems = useCallback(() => {
    if (hasMore && !loading && searchText === '') { // Only load more if not searching
      getAllMembersList(page + 1);
    }
  }, [page, hasMore, loading, searchText]);

  const onItemPress = (item) => {
    navigation.navigate("MemberProfile", { userId: item.id });
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={{ width: DeviceDimentions.width, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.devider} />
    </View>
  );

  const renderItem = ({ item, index, section }) => {
    if (index % 2 === 0) {
      return (
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => onItemPress(item)} activeOpacity={0.8} style={styles.item}>
            <View style={styles.imageContainer}>
              <View style={styles.imagebatchMainConatiner}>
                {item.cdh_whs_number &&
                  <View style={styles.batch}>
                    <AppText
                      styleText={styles.batchtext}
                      children={item.cdh_whs_number}
                    />
                  </View>
                }

                {item?.profile_photo ? (
                  <CustomImage
                    source={{ uri: item.profile_photo }}
                    placeholderSource={IMAGES.logo_blue}
                    style={styles.image}
                    resizeMode="cover"
                    showLoadingIndicator={true}
                  />
                ) : (
                  <Image source={IMAGES.memberWhite} style={styles.profileImage1} />
                )}
              </View>
              <AppText styleText={styles.text} children={item.name} />
              <AppText styleText={styles.subtext} children={item.position} />
              <AppText styleText={styles.subtext} children={item.business_name} />
              <View style={styles.sectorContainer}>

                <View style={{ flexDirection: 'row', width: DeviceDimentions.width / 2.5, paddingBottom: 5 }}>
                  <Image source={IMAGES.sector} style={styles.sector} />
                  <AppText styleText={styles.sectortext} children={item.sector ? item.sector : '--'} />
                </View>

                <View style={{ flexDirection: 'row', width: DeviceDimentions.width / 2.5 }}>
                  <Image source={IMAGES.location} style={styles.sector} />
                  <AppText styleText={styles.sectortext} children={item.location ? item.location : '--'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {section.data[index + 1] && (
            <TouchableOpacity onPress={() => onItemPress(section.data[index + 1])} activeOpacity={0.8} style={styles.item}>
              <View style={styles.imageContainer}>
                <View style={styles.imagebatchMainConatiner}>
                  {section.data[index + 1]?.profile_photo ? (
                    <CustomImage
                      source={{ uri: section.data[index + 1].profile_photo }}
                      placeholderSource={IMAGES.logo_blue}
                      style={styles.image}
                      resizeMode="cover"
                      showLoadingIndicator={true}
                    />
                  ) : (
                    <Image source={IMAGES.memberWhite} style={styles.profileImage1} />
                  )}
                </View>
                <AppText styleText={styles.text} children={section.data[index + 1].name} />
                <AppText styleText={styles.subtext} children={section.data[index + 1].position} />
                <AppText styleText={styles.subtext} children={section.data[index + 1].bussinessname} />
                <View style={styles.sectorContainer}>
                  {section.data[index + 1].sector && (
                    <View style={{ flexDirection: 'row', width: DeviceDimentions.width / 2.5, paddingBottom: 5 }}>
                      <Image source={IMAGES.sector} style={styles.sector} />
                      <AppText styleText={styles.sectortext} children={section.data[index + 1].sector} />
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', width: DeviceDimentions.width / 2.5 }}>
                    <Image source={IMAGES.location} style={styles.sector} />
                    <AppText styleText={styles.sectortext} children={"Location"} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return null; // Skip rendering individual items since they are handled in pairs
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTop title="Members" />
      <View style={styles.fillterMainConteiner}>
        <View style={styles.fillterConteiner}>
          <EspTextInput
            label=""
            value={searchText}
            onChangeText={filterMembersByName} // Updated to use search function
            placeholder="Search by name"
            autoCapitalize="none"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => toggleModal()} activeOpacity={0.8}>
            <Image source={IMAGES.Filltericon} style={styles.filltericonImage} />
          </TouchableOpacity>
        </View>
      </View>

      <SectionList
        sections={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={!loading && <Text style={styles.noItemsText}>No members found!</Text>}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() =>
          loading && <ComponentLoader size="large" color={AppColors.defaultColor} />
        }
      />

      <FilterPortal
        heading="Filter by:"
        listItems={filterItems}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        SelectedFillterItem={SelectedFillterItem}
      />
    </SafeAreaView>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', height: DeviceDimentions.height },
  filterContainer: { flexDirection: 'row', alignItems: 'center', margin: 10 },
  filterIcon: { width: 32, height: 32, resizeMode: 'contain' },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  devider: {
    backgroundColor: AppColors.black,
    height: 2,
    width: '90%',
    marginVertical: moderateScale(15)
  },
  text: { fontSize: moderateScale(FontSizes.small), fontWeight: 'bold', color: '#000' },
  subtext: { fontSize: moderateScale(FontSizes.small), color: AppColors.gray },
  noItemsText: { color: AppColors.black, fontSize: FontSizes.small, textAlign: 'center', marginTop: 20 },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height: DeviceDimentions.height
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: 16,
  },
  profileImage1: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: 12,
    backgroundColor: AppColors.gray1,
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
    fontSize: moderateScale(FontSizes.medium),
    height: moderateScale(40),
    paddingHorizontal: moderateScale(10)
  },
  filltericonImage: {
    width: 32, height: 32, resizeMode: 'contain'
  },
  batch: {
    backgroundColor: 'red',
    minWidth: 25, minHeight: 25,
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 10, right: 5,
    top: 5, alignItems: 'center',
    justifyContent: 'center',
  },
  batchtext: {
    fontSize: moderateScale(FontSizes.small),
    color: AppColors.white,
    fontWeight: '500',
    paddingHorizontal: 5
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(FontSizes.medium),
    fontWeight: "700",
    color: AppColors.black,
    width: DeviceDimentions.width / 2.2
  },
  imagebatchMainConatiner: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignSelf: 'center'
  },
  subtext: {
    fontSize: moderateScale(FontSizes.small),
    fontWeight: "500",
    color: AppColors.gray,
    width: DeviceDimentions.width / 2.2,
    lineHeight: 20
  },
  sector: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  sectortext: {
    color: AppColors.gray,
    paddingLeft: 5,
    fontSize: moderateScale(FontSizes.small),
  },
  sectorContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DeviceDimentions.width / 2.3,
    alignSelf: 'center'
  },
  sectionHeader: {
    color: AppColors.black,
    fontSize: FontSizes.large,
    fontWeight: '500',
    paddingHorizontal: moderateScale(10)
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(15),
    paddingHorizontal: moderateScale(15)
  },
  item: {
    width: '48%', // Adjust spacing between items
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    alignItems: 'center',
  },
});