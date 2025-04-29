import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppColors, DeviceDimentions } from '../Utils/Constants';
import { moderateScale } from 'react-native-size-matters';

const FilterModal = ({ isVisible, onClose, heading, listItems, SelectedFillterItem }) => {

    const OnItemClick = (item) => {
        SelectedFillterItem(item)
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} activeOpacity={1} style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity activeOpacity={1} style={styles.HeaderConteiner}>
                        <Text style={styles.modalHeading}>{heading}</Text>
                    </TouchableOpacity>
                    <ScrollView>
                        {listItems.map((item, index) => (
                            <TouchableOpacity onPressIn={OnItemClick} activeOpacity={0.5} key={index} style={styles.listItem}
                                onPress={() => console.log(item)}>
                                <Text style={styles.listText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: AppColors.white,
        borderRadius: 20,
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
        borderColor: AppColors.borderColor,
        height: 50,
        justifyContent: 'center'
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

export default FilterModal;