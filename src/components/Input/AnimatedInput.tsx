import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import {colors, font} from '../../assets';

interface Props extends TextInputProps {
  label: string;
  onChangeText?: (text: string) => void;
  value: string;
  editable?: boolean;
  style?: ViewStyle;
  stylesInput?: TextInputProps['style'];
  suffix?: React.ReactNode;
  blurPosition?: number;
  suffixPosition?: number;
}
const AnimatedInput = ({
  label,
  onChangeText,
  value = '',
  editable = true,
  style,
  suffix,
  stylesInput,
  blurPosition = 0,
  suffixPosition = 20,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const labelPosition = useState(new Animated.Value(0))[0];
  const labelScale = useState(new Animated.Value(1))[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animateLabel = (position: number, scale: number) => {
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: position,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(labelScale, {
        toValue: scale,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (value && value.trim() !== '') {
      animateLabel(-10, 1);
    }
  }, [value, animateLabel]);

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(-10, 1);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (value?.trim() === '') {
      animateLabel(blurPosition, 1);
    }
  };

  return (
    <View style={[styles(isFocused, !!suffix).container, style]}>
      <Animated.Text
        style={[
          styles(isFocused || value?.length > 0).label,
          {
            transform: [{translateY: labelPosition}, {scale: labelScale}],
          },
        ]}>
        {label}
      </Animated.Text>
      <TextInput
        allowFontScaling={false}
        editable={editable}
        style={[styles(isFocused, !!suffix).input, stylesInput]}
        value={value}
        focusable={isFocused}
        returnKeyType="done"
        onSubmitEditing={() => {
          handleBlur();
        }}
        scrollEnabled={false}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {suffix && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: style?.height ? +style.height / 2 - 12 : suffixPosition,
          }}>
          {suffix}
        </View>
      )}
    </View>
  );
};

const styles = (isFocused?: boolean, suffix?: boolean) => {
  return StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      position: 'absolute',
      left: 16,
      top: 16,

      fontSize: isFocused ? 14 : 16,
      color: isFocused ? colors.gray : colors.grey2,
      fontFamily: font.regular,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.grey3,
      borderRadius: 6,
      paddingBottom: 8,
      paddingTop: 24,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.fontBlack,
      fontFamily: font.regular,
      minHeight: 56,
      width: '100%',
      paddingRight: suffix ? 50 : 16,
    },
  });
};

export default AnimatedInput;
