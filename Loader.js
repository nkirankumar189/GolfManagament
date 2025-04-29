import { useState } from 'react';
import { Alert, StyleSheet, Pressable, Modal, TouchableOpacity, View, Text, ActivityIndicator, } from 'react-native';
import {scale, moderateScale } from 'react-native-size-matters';
import { Line } from './Line';
import { AppColors } from '../Utils/Constants';




export const Loader = (props) => {
    const {
    size = 'large', color = AppColors.defaultColor,loader
    } = props;

    // const handleCloseModal = () => {
    //     setModalVisible(!loader);
    // };


    return (
        <View style={styles.centeredView}>
            <Modal
                visible={loader}
                transparent
                // animationType="fade"
                // onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={{}}>
                        <View style={{}}>
                        <ActivityIndicator size={size} color={color} animating={loader}/>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // modalContent: {
    //     width:moderateScale(300),
    //     height:moderateScale(180),
    //     backgroundColor: 'white',
    //     padding: moderateScale(20),
    //     borderRadius: 10,
    //     alignItems: 'center',
    // },
    modalTitle: {
        top:moderateScale(20),
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#2E3192',
        // marginBottom: moderateScale(10),
    },
    modalSubtitle: {
        top:moderateScale(20),
        fontSize: 20,
        fontWeight: '700',
        color: '#2E3192',
        // marginBottom: moderateScale(15),
    },
    modalSubtitle1:{
        top:moderateScale(25),
        fontSize: 20,
        fontWeight: '700',
        color: '#ED1C24',
        // marginBottom: moderateScale(15),
    },

    actionButton: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: 20,
    },
    confirmButtonText: {
        color: '#2E3192',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButtonText: {
        color: '#2E3192',
        fontSize: 16,
        // fontWeight: 'bold',
    },
    divider: {
        height: scale(43),
        width: .5, // Vertical line
        backgroundColor: '#000',
        marginHorizontal: moderateScale(30), // Space between buttons and line
    },
});

export default Loader;