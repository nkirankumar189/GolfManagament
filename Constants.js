import { Dimensions } from "react-native";

export const DeviceDimentions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}
export const FontSizes = {
    verysmall:10,
    small: 12,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32,
    xxxlarge: 38,
    // Add more as needed
};
export const AppColors = {
    defaultColor: '#2E3192',
    white: '#FFFFFF',
    red: '#FF1D25',
    borderColor: "#B6B6B6",
    black: '#000',
    gray: 'gray',
    transparent: 'rgba(0, 0, 0, 0.3)',
    gray1: '#E5E5E5',
    success:'green',
    link:'blue',
    fb:"#3B5998",
    in:"#0073B0"
}