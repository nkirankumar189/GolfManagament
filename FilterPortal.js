import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Chip, Text, Portal, Button } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { AppColors, DeviceDimentions } from '../Utils/Constants';

const FilterPortal = ({ visible, onClose, heading, listItems, SelectedFillterItem }) => {
    const [selectedFilter, setSelectedFilter] = React.useState(null);

    if (!visible) return null;
    const OnItemClick = (item) => {
        SelectedFillterItem(item)
        setSelectedFilter(item)
    }
    return (
        <Portal>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.outerContainer}>
                <View style={styles.modalView}>
                    <TouchableOpacity activeOpacity={1} style={styles.HeaderConteiner}>
                        <Text style={styles.modalHeading}>{heading}</Text>
                    </TouchableOpacity>
                    <ScrollView style={{ paddingVertical: 10 }}>
                        {listItems.map((item, index) => (
                            <TouchableOpacity activeOpacity={0.5} key={index}
                                style={[styles.listItem, { backgroundColor: selectedFilter == item ? '#D4D4D4' : AppColors.white }]}
                                onPress={() => OnItemClick(item)}>
                                <Text style={styles.listText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: AppColors.white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: DeviceDimentions.width - moderateScale(100),
    },
    modalHeading: {
        fontWeight: '700',
        fontSize: moderateScale(18),
        color: AppColors.defaultColor
    },
    listItem: {
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: '#D4D4D4',
        height: 50,
        justifyContent: 'center',
    },
    listText: {
        fontSize: 20,
        padding: moderateScale(5),
        color: AppColors.defaultColor,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    HeaderConteiner: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center'
    }
});

export default FilterPortal;