import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ViewProps,
  TextStyle,
} from 'react-native';
import {colors, font, icons} from '../assets';
import {normalize} from '../function/Normalize';
import Text from './Text';

interface Prop {
  title?: string | JSX.Element;
  showBackBtn?: boolean;
  titleColor?: string;
  backgroundColor?: string;
  onPressBack?: () => void;
  headerRight?: () => JSX.Element;
  headerLeft?: () => JSX.Element;
  headerCenter?: JSX.Element;
  style?: ViewProps['style'];
  styleWrapper?: ViewProps['style'];
  image?: () => JSX.Element;
  styleTitle?: TextStyle;
}

const CustomHeader: React.FC<Prop> = ({
  style,
  title,
  showBackBtn,
  titleColor,
  onPressBack,
  headerLeft,
  headerRight,
  image,
  headerCenter,
  styleWrapper,
  styleTitle,
}) => {
  return (
    <SafeAreaView style={[styles.headerSafeArea, style]}>
      <View style={[styles.headerWrapper, styleWrapper]}>
        <View style={headerLeft ? styles.headerLeftWrapper : styles.noLeftSide}>
          {showBackBtn && (
            <TouchableOpacity
              style={{paddingVertical: 14, paddingHorizontal: 24}}
              onPress={onPressBack}>
              <Image
                source={icons.arrowLeft}
                style={{
                  width: 28,
                  height: 28,
                }}
              />
            </TouchableOpacity>
          )}
          {headerLeft?.()}
        </View>
        <View style={styles.headerTitleWraper}>
          {headerCenter ? (
            headerCenter
          ) : (
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(20),
                color: titleColor ?? colors.fontBlack,
                textAlign: 'center',
                ...styleTitle,
              }}>
              {title}
            </Text>
          )}
        </View>

        <View
          style={headerRight ? styles.headerRightWrapper : styles.noRightSide}>
          {headerRight?.()}
        </View>
        <View style={styles.fav}>{image?.()}</View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: colors.white,
  },
  noRightSide: {
    width: normalize(30),
  },
  noLeftSide: {
    width: normalize(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: normalize(75),
  },
  headerTitleWraper: {
    flex: 3,
    justifyContent: 'center',
  },
  headerLeftWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: font.bold,
    fontSize: normalize(18),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  fav: {
    flexDirection: 'row',
    alignItems: 'center',
    right: '5%',
  },
});
