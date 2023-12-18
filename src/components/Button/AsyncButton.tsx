import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
  TextStyle,
} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import Loading from '../Loading/Loading';
import Text from '../Text';

interface TypeButton {
  primary: string;
  secondary: string;
}

interface Props extends TouchableOpacityProps {
  title: string;
  type?: 'primary' | 'secondary' | 'disabled';
  noBorder?: boolean;
  onPress?: () => Promise<void> | void;
  isLoading?: boolean;
  styleText?: TextStyle;
  disabled?: boolean;
  transparent?: boolean;
}
export default function AsyncButton({
  title,
  style,
  type = 'primary',
  onPress,
  noBorder = false,
  isLoading = false,
  styleText,
  transparent = false,
  ...props
}: Props) {
  const mappingText = {
    primary: 'primaryText',
    secondary: 'secondaryText',
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[
        styles({noBorder, disabled: props.disabled})[type as keyof TypeButton],
        style,
        transparent && {backgroundColor: 'transparent'},
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isLoading && <Loading style={{marginRight: 8}} />}

        <Text
          style={[
            styles({noBorder, disabled: props.disabled})[
              mappingText[
                type as keyof typeof mappingText
              ] as keyof typeof styles
            ],
            styleText,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const disable = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: colors.disable,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.disable,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});

const styles = (props: {noBorder: boolean; disabled?: boolean}) =>
  StyleSheet.create({
    primary: props.disabled
      ? disable.button
      : {
          backgroundColor: colors.orange,
          minHeight: 54,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 8,
          shadowColor: props.disabled ? '#fff' : '#F86820',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
    primaryText: {
      color: colors.white,
      fontFamily: font.bold,
      fontSize: 20,
    },
    secondaryText: {
      color: colors.fontBlack,
      fontFamily: font.bold,
      fontSize: 20,
    },

    secondary: {
      backgroundColor: colors.white,
      minHeight: 54,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: props.noBorder ? 0 : 1,
      borderColor: colors.disable,
    },
  });
