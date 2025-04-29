import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import { AppColors } from '../Utils/Constants';

const LogoutConfirmation = ({ visible, onDismiss, onConfirm }) => {
    return (
        <Portal>
            <Dialog style={styles.container} visible={visible} onDismiss={onDismiss}>
                <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={styles.dialogText}>Are you sure you want to logout?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button labelStyle={styles.cancelButtonLabel} onPress={onDismiss}>Cancel</Button>
                    <Button labelStyle={styles.logoutButtonLabel} onPress={onConfirm}>Logout</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: AppColors.white,
        shadowColor:AppColors.white,
        borderRadius:15
    },
    ConfirmButton: {
        color: AppColors.red
    },
    logoutButtonLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: AppColors.red
    },
    cancelButtonLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: AppColors.defaultColor
    },
    dialogTitle: {
        color: AppColors.defaultColor, // Black color
    },
    dialogText: {
        color: AppColors.defaultColor, // Black color
    },
});

export default LogoutConfirmation;