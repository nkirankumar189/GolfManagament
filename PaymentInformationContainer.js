import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Image,
  Keyboard,
  BackHandler,
} from 'react-native';
import AppText from '../../../Components/AppText';
import {IMAGES} from '../../../assets/images/images';
import {scale, moderateScale, verticalScale} from 'react-native-size-matters';
import CustomButton from '../../../Components/CustomButton';
import {AppColors, DeviceDimentions} from '../../../Utils/Constants';
import {
  CardField,
  initStripe,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';
import SimpleHeader from '../../../Components/SimplaeHeader';
import CreditCardForm from '../../../Components/CreditCardForm';
import ApihelperModule from '../../../services/ApihelperModule';
import Path from '../../../services/Api';
import {getStorageItem} from '../../../Utils/CustomFunctions/CustomFunctions';
import PaymentSuccessPortal from '../../../Components/PaymentSuccessPortal';
import ComponentLoader from '../../../Components/ComponentLoader';

const PaymentInformationContainer = props => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [returnMessage, setReturnMessage] = useState(false);
  const [sripekeys, setSripekeys] = useState({});
  const [publishableKey, setPublishableKey] = useState(null);
  const {createPaymentMethod} = useStripe();
  const [cardDetails, setCardDetails] = useState({});
  const creditCardRef = useRef(null);
  const [apiError, setApiError] = useState([]);
  const [monthlyMemberFee, setmonthlyMemberFee] = useState('');
  const [groupId, setGroupId] = useState('');
  const [email, setemail] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    GetProfileDetails();
    GetUserDetails();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true, // Return true to disable back button
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, []);
  const GetUserDetails = async () => {
    let monthly_member_fee = await getStorageItem('monthly_member_fee');
    let group_id = await getStorageItem('group_id');
    let email = await getStorageItem('email');

    console.log('monthly_member_fee:', monthly_member_fee);
    setmonthlyMemberFee(monthly_member_fee);
    setGroupId(group_id);
    setemail(email);
  };
  const GetPaymentMethoad = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }
    console.log('email:', email);

    const {paymentMethod, error} = await createPaymentMethod({
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          email: email,
        },
      },
    });

    if (error) {
      console.log('Payment method creation error', error);
      Alert.alert('Error', error.message);
    } else {
      console.log('Payment Method ID:', paymentMethod.id);
      console.log('Success', `Payment method created: ${paymentMethod.id}`);
      await setPaymentMethodId(paymentMethod.id);
      // Send this ID to your backend to use with a PaymentIntent or save it
      await CreateSubscription(paymentMethod.id);
    }
  };
  const GetProfileDetails = async () => {
    setLoader(true);
    ApihelperModule.getData(Path.settings_keys)
      .then(response => {
        console.log('response:', response.data.data);
        if (
          response.data != '' &&
          response.data != null &&
          response.data != undefined
        ) {
          if (response.data.success) {
            setLoader(false);
            setPublishableKey(response.data.data.publishable_key);
            initStripe({
              publishableKey: response.data.data.publishable_key,
            });

            setSripekeys(response.data.data);
          } else {
            setLoader(false);
          }
        } else {
          setLoader(false);
        }
      })
      .catch(err => {
        setLoader(false);
      });
  };

  const handlePayment = async () => {
    setLoader(true);
    try {
      GetPaymentMethoad();
    } catch (e) {
      console.error('Payment Error:', e);
    } finally {
      setLoader(false);
    }
  };
  const CreateSubscription = async payment_method_id => {
    
    
    let user_id = await getStorageItem('user_id');
    console.log("i am here@!",payment_method_id,user_id);
    // setApiError([]);
    // Keyboard.dismiss();
    setLoader(true);
    // setReturnMessage('');
    //setSuccessMessage("")
    const Request = {
      user_id: user_id || '',
      payment_method_id: payment_method_id,
    };
    console.log('Request:', Request);
    ApihelperModule.postData(Path.subscription_create, Request)
      .then(response => {
        console.log('response:', response);
        if (
          response.data != '' &&
          response.data != null &&
          response.data != undefined
        ) {
          if (response.data.success) {
            setLoader(false);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              navigation.navigate('ChoosePassword'); 
            }, 1000);
          } else {
            setApiError(response.data.errors);
            if (response.data.errors == undefined) {
              setReturnMessage(response.data.message);
            }
            //setOTPError(response.data.message)
            setLoader(false);
          }
        } else {
          setLoader(false);
          setReturnMessage('Invalid server respons/./...e');
        }
      })
      .catch(err => {
        setLoader(false);
        setReturnMessage('Invalid server response');
      });
  };

  if (publishableKey != null) {
    return (
      <StripeProvider publishableKey={publishableKey}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{justifyContent: 'center'}}>
          {/* <SimpleHeader /> */}

          <View style={styles.container}>
            <Image source={IMAGES.logo_blue} style={styles.logo} />

            <AppText styleText={styles.text} children={'Payment Information'} />
            <View style={{width: DeviceDimentions.width / 1.1}}>
              {/* <CreditCardForm ref={creditCardRef} /> */}
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: '0000 0000 0000 0000',
                  validCVC: '000',
                  validExpiryDate: 'MM/YY',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                  borderWidth: 1,
                  borderColor: AppColors.borderColor,
                  borderRadius: 10,
                }}
                style={{
                  height: moderateScale(45),
                  marginVertical: verticalScale(20),
                  backgroundColor: AppColors.white,
                }}
                onCardChange={details => {
                  setCardDetails(details);
                }}
              />
            </View>

            <View style={styles.card}>
              <AppText
                styleText={styles.benefitTitle}
                children={'PLEASE NOTE :'}
              />
              <AppText
                styleText={{
                  color: '#000000',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
                viewStyle={{top: 1}}
                children={
                  'Upon pressing continue, you are \n   agreeing to pay the fee of'
                }
              />
              <AppText
                styleText={{
                  color: '#000000',
                  fontSize: moderateScale(16),
                  fontWeight: '700',
                  textAlign: 'center',
                }}
                viewStyle={{top: 1}}
                children={`£${monthlyMemberFee} (+VAT) `}
              />
              <AppText
                styleText={{
                  color: '#000000',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
                viewStyle={{top: 1}}
                children={
                  'you will then be charged the same \nrecurring fee every 30 days.'
                }
              />
            </View>

            {returnMessage && (
              <AppText
                styleText={styles.returnMesaegtext}
                viewStyle={{width: DeviceDimentions.width / 1.22}}
                children={returnMessage}
              />
            )}
            {loader ? (
              <ComponentLoader
                size="large"
                color={AppColors.defaultColor}
                style={{
                  width: scale(148),
                  height: scale(45),
                  alignSelf: 'center',
                }}
              />
            ) : (
              <CustomButton
                title={loader ? 'Processing...' : 'Continue'}
                onPress={handlePayment}
                backgroundColor={'#2E3192'}
                containerStyle={styles.continueButton}
                color={'#fff'}
                disabled={loader || !cardDetails.complete}
              />
            )}
          </View>

          <PaymentSuccessPortal
            visible={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        </KeyboardAvoidingView>
      </StripeProvider>
    );
  } else {
    return <></>;
  }
};

export default PaymentInformationContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  continueButton: {
    width: scale(148),
    height: scale(45),
    marginTop: moderateScale(25),
  },
  logo: {
    marginVertical: verticalScale(30),
    resizeMode: 'contain',
    width: moderateScale(160),
    height: moderateScale(160),
  },
  returnMesaegtext: {
    padding: 5,
    fontSize: moderateScale(12),
    color: AppColors.red,
    textAlign: 'center',
    marginTop: 10,
  },
  inputStyle: {
    height: moderateScale(40),
    color: AppColors.black,
  },
  inputContainer: {
    marginTop: moderateScale(10),
  },
  container: {
    alignItems: 'center',
  },
  row: {
    alignSelf: 'flex-end',
  },
  text: {
    padding: moderateScale(5),
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#2E3192',
  },
  card: {
    backgroundColor: '#fff',
    padding: moderateScale(15),
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: moderateScale(15),
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3192',
    marginBottom: 8,
    textAlign: 'center',
  },
  benefit: {
    flexDirection: 'row',
    fontSize: moderateScale(14),
    color: '#2E3192',
    padding: 4,
    marginBottom: 6,
  },
  pricing: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: '#2E3192',
    marginVertical: 8,
  },
  price: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3192',
  },
  bold: {
    fontWeight: 'bold',
    color: '#2E3192',
  },
  membertext: {
    top: 10,
  },
});
