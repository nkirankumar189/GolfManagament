import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import { moderateScale } from "react-native-size-matters";
import { AppColors, DeviceDimentions, FontSizes } from "../Utils/Constants";
import { IMAGES } from "../assets/images/images";

const getCardType = (number) => {
  const cardPatterns = {
    Visa: { regex: /^4/, icon: "cc-visa" },
    MasterCard: { regex: /^5[1-5]/, icon: "cc-mastercard" },
    Amex: { regex: /^3[47]/, icon: "cc-amex" },
    Discover: { regex: /^6(?:011|5)/, icon: "cc-discover" },
    DinersClub: { regex: /^3(?:0[0-5]|[68])/, icon: "cc-diners-club" },
    JCB: { regex: /^(?:2131|1800|35)/, icon: "cc-jcb" },
    UnionPay: { regex: /^62/, icon: "cc-unionpay" },
    Maestro: { regex: /^(?:5[06789]|6)/, icon: "cc-maestro" },
  };


  for (const [card, { regex, icon }] of Object.entries(cardPatterns)) {
    if (regex.test(number)) return { card, icon };
  }
  return { card: "", icon: "credit-card" }; // Default icon
};

// Luhn Algorithm for card validation
const isValidLuhn = (number) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const CreditCardForm = forwardRef((props, ref) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardIcon, setCardIcon] = useState("credit-card");

  const expiryRef = useRef(null);
  const cvcRef = useRef(null);

  // Error states
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvcError, setCvcError] = useState("");

  // Validation functions
  const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date);
  const validateCVC = (code) => /^\d{3,4}$/.test(code);

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    getFormData: () => ({ cardNumber, expiryDate, cvc }),
    validateAndSubmit: () => {
      let isValid = true;
    
      const sanitizedCardNumber = cardNumber.replace(/\s+/g, "");
      const { card, icon } = getCardType(sanitizedCardNumber);
    
      // Card-specific lengths
      const cardNumberLengths = {
        Visa: [13, 16, 19],
        MasterCard: [16],
        Amex: [15],
        Discover: [16],
        DinersClub: [14],
        JCB: [16],
        UnionPay: [16, 17, 18, 19],
        Maestro: [12, 13, 14, 15, 16, 17, 18, 19]
      };
    
      const validLengths = cardNumberLengths[card] || [16]; // Default fallback
      if (sanitizedCardNumber === "") {
        setCardError("Card number is required.");
        isValid = false;
      } else if (!validLengths.includes(sanitizedCardNumber.length)) {
        setCardError(`Card number must be ${validLengths.join(", ")} digits.`);
        isValid = false;
      } else if (!isValidLuhn(sanitizedCardNumber)) {
        setCardError("Invalid card number.");
        isValid = false;
      } else {
        setCardError("");
      }
    
      // Expiry
      if (!validateExpiryDate(expiryDate)) {
        setExpiryError("Enter a valid expiry date (MM/YY).");
        isValid = false;
      } else {
        setExpiryError("");
      }
    
      // CVC - Card-specific
      const cvcValidLength = card === "Amex" ? 4 : 3;
      if (!new RegExp(`^\\d{${cvcValidLength}}$`).test(cvc)) {
        setCvcError(`CVC must be ${cvcValidLength} digits for ${card || "this card"}.`);
        isValid = false;
      } else {
        setCvcError("");
      }
    
      return isValid ? { cardNumber, expiryDate, cvc } : false;
    }
    

  }));

  const CustomCCard = () => {
    switch (cardIcon) {
      case "cc-maestro":
        return <Image source={IMAGES.maestro} style={{ width: 30, height: 20 }} />
      case 'cc-unionpay':
        return <Image source={IMAGES.unionpay} style={{ width: 40, height: 20 }} />
      default:
        return <Image source={IMAGES.BrowseGroup} style={{ width: 40, height: 20 }} />;
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{}}>
      <View style={styles.container}>

        {/* Card Number Field */}
        <Text style={styles.label}>Card Number</Text>
        <View style={styles.cardInputContainer}>
          {console.log("cardIcon:", cardIcon)}
          {(cardIcon == 'cc-maestro' || cardIcon == 'cc-unionpay') ?
            <CustomCCard />
            :
            <Icon name={cardIcon} size={24} color={AppColors.defaultColor} style={styles.cardIcon} />
          }
          <TextInput
            style={[styles.input, { flex: 1, borderWidth: 0 }]}
            keyboardType="numeric"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            placeholderTextColor={AppColors.borderColor}
            onChangeText={(text) => {
              const sanitizedText = text.replace(/\D/g, "");
              setCardNumber(sanitizedText.replace(/(\d{4})/g, "$1 ").trim());

              const { card, icon } = getCardType(sanitizedText);
              setCardType(card);
              setCardIcon(icon);

              if (sanitizedText.length === 16) expiryRef.current?.focus();
            }}
            value={cardNumber}
          />
        </View>
        {cardError ? <Text style={styles.errorText}>{cardError}</Text> : null}

        {/* Expiry Date Field */}
        <Text style={styles.label}>Expiry Date</Text>
        <TextInput
          ref={expiryRef}
          style={styles.input}
          keyboardType="numeric"
          placeholder="MM/YY"
          placeholderTextColor={AppColors.borderColor}
          maxLength={5}
          onChangeText={(text) => {
            let formattedText = text.replace(/[^0-9]/g, "");
            if (formattedText.length > 2) {
              formattedText = formattedText.slice(0, 2) + "/" + formattedText.slice(2, 4);
            }
            setExpiryDate(formattedText);

            if (formattedText.length === 5) cvcRef.current?.focus();
          }}
          value={expiryDate}
        />
        {expiryError ? <Text style={styles.errorText}>{expiryError}</Text> : null}

        {/* CVC Field */}
        <Text style={styles.label}>CVC</Text>
        <TextInput
          ref={cvcRef}
          style={styles.input}
          keyboardType="numeric"
          placeholder="000"
          maxLength={3}
          placeholderTextColor={AppColors.borderColor}
          onChangeText={(text) => setCvc(text.replace(/\D/g, ""))}
          value={cvc}
          secureTextEntry
        />
        {cvcError ? <Text style={styles.errorText}>{cvcError}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: moderateScale(DeviceDimentions.width / 12), marginTop: moderateScale(20) },
  label: { fontSize: FontSizes.small, marginVertical: 5, paddingLeft: 5, fontWeight: '500' },
  cardInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    borderRadius: 5,
    padding: 10,
    height: moderateScale(45),
    // marginBottom: moderateScale(8),
    justifyContent: 'center'
  },
  input: {
    // flex: 1,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    borderRadius: 5,
    padding: 10,
    marginBottom: 2,
    height: moderateScale(45),
    fontSize: moderateScale(19),
    fontWeight: '500'
  },
  cardIcon: {
    marginRight: 10,
  },
  errorText: {
    color: AppColors.red,
    fontSize: FontSizes.small,
    // marginBottom: 5,
    paddingLeft: 5,
  },
});

export default CreditCardForm;
