import { useState } from 'react';
import { Alert, StyleSheet, Pressable, Modal, TouchableOpacity, View, Text, TouchableWithoutFeedback, ActivityIndicator, } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Line } from './Line';
import { Portal } from 'react-native-paper';
import AppLoader from './AppLoader';
import { AppColors, DeviceDimentions, FontSizes } from '../Utils/Constants';

export const Model = (props) => {
    const {
        modalVisible, text, text2, text3,
        cardData, navigation, handleConfirm, textStyle,
        modelContent1, handleCloseModal, loader, error
    } = props;
    if (!modalVisible) return null;
    return (
        <Portal>
            <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.outerContainer}>

                <View style={[styles.modalContent, { ...modelContent1 }]}>
                    {loader ?
                    <View style={{height:DeviceDimentions.height/5,alignItems:'center',justifyContent:'center'}}>
                        <ActivityIndicator size='large' color={AppColors.defaultColor} />
                        <Text style={{color:AppColors.defaultColor,fontSize:FontSizes.large,paddingTop:10,fontWeight:'700'}}>Payment processing...</Text>
                        </View>
                        :
                        <View style={{}}>
                            {error.length == 0 ?
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.modalTitle, { ...textStyle }]}>{text}</Text>
                                    <Text style={styles.modalSubtitle}>{cardData}</Text>
                                    <Text style={styles.modalSubtitle1}>{text2}</Text>
                                    <View style={{ borderBottomWidth: .5, width: moderateScale(300), top: moderateScale(42) }} />
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity onPress={handleConfirm} style={styles.actionButton}>
                                            <Text style={styles.confirmButtonText}>Confirm</Text>
                                        </TouchableOpacity>
                                        <View style={styles.divider} />
                                        <TouchableOpacity onPress={handleCloseModal} style={styles.actionButton}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <>
                                    <View style={{ width: '80%', alignItems: 'center',paddingVertical:20 }}>
                                        {error.map((item, index) => (
                                            <Text key={index} style={{ color: 'red', textAlign: 'left', padding: 5 }}>
                                                {item.message}
                                            </Text>
                                        ))}
                                        <TouchableOpacity onPress={handleCloseModal} style={[styles.actionButton, { borderWidth: 1, borderRadius: 10, marginTop: 20, borderColor: AppColors.defaultColor }]}>
                                            <Text style={styles.cancelButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </View>
                    }

                </View>

            </View>
        </Portal>

    );
};

export const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // modalContainer: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    outerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,

    },
    modalContent: {
        width: moderateScale(300),
       // height: moderateScale(180),
        backgroundColor: 'white',
       // padding: moderateScale(20),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalTitle: {
        top: moderateScale(20),
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#2E3192',
        // marginBottom: moderateScale(10),
    },
    modalSubtitle: {
        top: moderateScale(20),
        fontSize: 20,
        fontWeight: '700',
        color: '#2E3192',
        // marginBottom: moderateScale(15),
    },
    modalSubtitle1: {
        top: moderateScale(25),
        fontSize: 20,
        fontWeight: '700',
        color: '#ED1C24',
        // marginBottom: moderateScale(15),
    },
    modalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(43),
    },
    actionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
});

export default Model;