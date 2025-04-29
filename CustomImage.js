import React from 'react';
import {
  Image as RNImage,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { AppColors } from '../Utils/Constants';
import { Image } from 'react-native';
import { IMAGES } from '../assets/images/images';

const CustomImage = ({
  source,
  style,
  resizeMode = 'cover',
  onLoadStart,
  onLoadEnd,
  onError,
  placeholderSource,
  showLoadingIndicator,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  // Alert.alert(JSON.stringify(hasError))
  const handleLoadStart = () => {
    setIsLoading(false);
    if (onLoadStart) onLoadStart();
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    if (onLoadEnd) onLoadEnd();
  };

  const handleError = error => {
    setIsLoading(false);
    setHasError(true);

    if (onError) onError(error);
  };

  const isValidSource = source && (typeof source === 'number' || (source.uri && typeof source.uri === 'string'));

  return (
    <View style={[styles.container, style]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={AppColors.defaultColor} />
        </View>
      ) : (
        <>
          {source == null ?
            <Image
              source={IMAGES.BlankuserImage}
              style={[styles.image, style]}
              resizeMode={resizeMode}
            />
            :
            <Image
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              source={(!isValidSource || hasError) && placeholderSource ? placeholderSource : source}
              style={[styles.image, style]}
              resizeMode={resizeMode}
              onError={handleError}
              {...props}
            />
          }

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

CustomImage.propTypes = {
  source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
  style: PropTypes.object,
  resizeMode: PropTypes.oneOf([
    'cover',
    'contain',
    'stretch',
    'repeat',
    'center',
  ]),
  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func,
  onError: PropTypes.func,
  placeholderSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  showLoadingIndicator: PropTypes.bool,
};

CustomImage.defaultProps = {
  resizeMode: 'cover',
  showLoadingIndicator: true,
};

export default CustomImage;
