import axios from 'axios';
import Path from './Api';
import { getStorageItem } from '../Utils/CustomFunctions/CustomFunctions';

const instance = axios.create({
    baseURL: Path.BaseUrl,
    headers: {
        "Content-Type": "application/json",
    }
});

instance.interceptors.request.use(async (config) => {
    var userToken = await getStorageItem('userToken');
    if (config.url == Path.login || config.url == Path.forgotPassWord ||
        config.url == Path.verifyOtp || config.url == Path.reset_password ||
        config.url == Path.member_signup || config.url == Path.getBusinessSector ||
        config.url == Path.CreatePaymentIntent || config.url == Path.verify_otp ||
        config.url == Path.settings_keys || config.url == Path.subscription_create ||
        config.url == Path.password_update) {
        return config;
    }
    // else if (config.url == 'api/VerifyOTP') {
    //     return config;
    // }
    else if (userToken != '' && userToken != undefined && userToken != null) {
        config.headers.authorization = 'Bearer ' + userToken;
        console.log("config:",config);
        
        return config;
    }

}, (error) => {
    console.log('error in helper module----', error)
    return Promise.reject(error);
});

export default {
    getData: (actionUrl) => instance({
        method: "GET",
        url: actionUrl,
        transformResponse: [function (data) {
            const json = JSON.parse(data)
            return json;
        }]
    }).catch(function (error) {
        if (error.response) {
        } else if (error.request) {
            //     // The request was made but no response was received
            //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            //     // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            //     // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }),

    postData: (actionUrl, requestData) => instance({
        method: "POST",
        url: actionUrl,
        data: requestData,
        transformResponse: [function (data) {
            const json = JSON.parse(data)
            return json;
        }]
    }).catch(function (error) {
        console.log(">>>>>>>>>", error);
    })
}