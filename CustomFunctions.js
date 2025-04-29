import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Path from "../../services/Api";
import ApihelperModule from "../../services/ApihelperModule";


export const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            let permissionsToRequest = [];

            if (Platform.Version >= 33) {
                // Android 13 and above
                permissionsToRequest.push(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
                );
            } else {
                // Android 12 and below
                permissionsToRequest.push(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
            }

            const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

            // Check if all permissions are granted
            const allPermissionsGranted = Object.values(granted).every(
                (result) => result === PermissionsAndroid.RESULTS.GRANTED
            );

            if (allPermissionsGranted) {
                console.log('All permissions granted');
            } else {
                console.log('Permissions denied');
                Alert.alert('Permissions required', 'You need to grant permissions to access the gallery.');
            }
        } catch (err) {
            console.warn(err);
        }
    } else {
        // For iOS, no need to request permissions here
    }
};

export const pickImage = async () => {
    const options = {
        mediaType: 'photo',
        quality: 0.8,
    };

    try {
        const response = await new Promise((resolve, reject) => {
            launchImageLibrary(options, (response) => {
                console.log('User cancelled image picker', response);

                if (response.didCancel) {
                    console.log('User cancelled image picker', response);
                    resolve(null); // Resolve with null if the user cancels
                } else if (response.error) {
                    reject(response.error); // Reject with error if there's an error
                } else if (response.assets && response.assets.length > 0) {
                    const source = response.assets[0];
                    resolve(source); // Resolve with the selected image asset
                } else {
                    resolve(null); // Resolve with null if no image is selected
                }
            });
        });

        return response; // Return the resolved value
    } catch (error) {
        console.error('Error picking image:', error);
        throw error; // Throw the error if something goes wrong
    }
};

export const getStorageItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Error getting item ${key}:`, error);
        return null;
    }
};

export const setStorageItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting item ${key}:`, error);
        return false;
    }
};

export const removeStorageItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing item ${key}:`, error);
        return false;
    }
};
export const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};
export const Logout = async () => {
    try {
        const response = await ApihelperModule.postData(Path.logout);
        console.log("Logout response:", response);
        if (response.data && response.data.success) {
            return true;
        }
        return false;
    } catch (err) {
        console.error("Logout error:", err);
        return false;
    }
};

const openURL = async (url) => {
    try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`; // Ensure the URL is valid
        }

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Cannot open this URL');
        }
    } catch (error) {
        Alert.alert('Error', 'An error occurred while trying to open the URL');
    }
};

export default openURL;

export const openGmail = async (mail) => {
    const recipient = mail;
    const subject = '';
    const body = '';

    // Gmail URL scheme (Android & iOS)
    const gmailUrl =
        Platform.OS === 'ios'
            ? `googlegmail://co?to=${recipient}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            : `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Fallback mailto URL
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
        // First, try to open Gmail
        const canOpenGmail = await Linking.canOpenURL(gmailUrl);

        if (canOpenGmail) {
            await Linking.openURL(gmailUrl);
        } else {
            // If Gmail isn't available, fall back to default mail handler
            await Linking.openURL(mailtoUrl);
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to open email client');
    }
};
export const openDialer = async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    try {
        const supported = await Linking.canOpenURL(url);
        //   if (supported) {
        await Linking.openURL(url);
        //   } else {
        //     Alert.alert('Error', 'Cannot open the dialer');
        //   }
    } catch (error) {
        Alert.alert('Error', 'An error occurred while trying to open the dialer');
    }
};
export const openMaps = async (address) => {
    const encodedAddress = encodeURIComponent(address);

    const url = Platform.select({
        ios: `maps:0,0?q=${encodedAddress}`, // Apple Maps
        android: `geo:0,0?q=${encodedAddress}` // Google Maps
    });

    try {
        //   const supported = await Linking.canOpenURL(url);
        //   if (supported) {
        await Linking.openURL(url);
        //   } else {
        //     Alert.alert('Error', 'Cannot open maps');
        //   }
    } catch (error) {
        Alert.alert('Error', 'An error occurred while trying to open maps');
    }
};
export const DateHelper = {
    getDay: (eventDate) => {
        const date = new Date(eventDate);
        const options = { weekday: 'long' }; // Format to get full weekday name
        const day = new Intl.DateTimeFormat('en-US', options).format(date);
        return day;
    },
    getMonthformat: (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        // Function to get the ordinal suffix (st, nd, rd, th)
        function getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return "th"; // 4th to 20th
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        }
        return `${day}${getOrdinalSuffix(day)} ${month}`;
    }

}
