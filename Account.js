import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { HeaderTop } from '../../Components/MainHeader/HeaderTop'
import CustomFlatList from '../../Components/CustomFlatList'
import { useNavigation } from '@react-navigation/native'
import AppText from '../../Components/AppText'
import { AppColors, DeviceDimentions, FontSizes } from '../../Utils/Constants'
import { moderateScale } from 'react-native-size-matters'

const Account = () => {

    const navigation = useNavigation()
    const data = [
        { id: '0', title: 'Membership Information' },
        { id: '1', title: 'Passwords & Security' },
        { id: '2', title: 'Account Preferences' },
        { id: '3', title: 'Payment Details' },
        { id: '4', title: 'Transaction History' },
    ];
    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8} style={styles.item}>
            <AppText
                styleText={styles.itemTitle}
                children={item.title}
            />
        </TouchableOpacity>
    );
    return (
        <SafeAreaView style={styles.container}>
            <HeaderTop title="Account" />

            <CustomFlatList
                numColumns={1}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                emptyListMessage="No items found!"
            />
        </SafeAreaView>
    )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    item: {
        width: DeviceDimentions.width - moderateScale(18),
        backgroundColor: AppColors.white,
        borderRadius: 15,
        marginTop: moderateScale(18)
    },
    itemTitle: {
        color: '#000000',
        fontSize: moderateScale(FontSizes.medium),
        fontWeight: '500',
        textAlign: 'left',
        padding: moderateScale(15)
    }
})