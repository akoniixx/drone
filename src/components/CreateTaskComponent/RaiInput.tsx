import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {font, icons} from '../../assets';
import fonts from '../../assets/fonts';
import {mixValidator} from '../../function/inputValidate';
import Text from '../Text';
import {normalize} from '../../function/Normalize';

type Props = {
  isError?: boolean;
  style?: ViewStyle;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  allowClear?: boolean;
  label?: string;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
};

type StyleProps = {
  isFocus?: boolean;
} & Props;

const RaiInput = ({
  value = '',
  onChangeText,
  placeholder,
  allowClear = true,
  maxLength,
  label,
  ...props
}: Props) => {
  const [isFocus, setIsFocus] = React.useState(false);
  const refTextInput = React.useRef<TextInput>(null);
  const onFocus = () => {
    setIsFocus(true);
    if (refTextInput.current) {
      refTextInput.current?.focus();
    }
  };
  const onClear = () => {
    onChangeText && onChangeText('');
  };
  return (
    <>
      {label && (
        <Text
          style={{
            fontSize: 18,
            fontFamily: font.medium,
            marginBottom: normalize(4),
          }}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={onFocus}
        style={[
          styles({
            isError: props.isError,
            isFocus,
          }).container,
          props.style,
        ]}>
        {placeholder && value?.length < 1 && (
          <Text style={styles(props).placeholder}>{placeholder}</Text>
        )}
        <TextInput
          scrollEnabled={false}
          keyboardType={'numeric'}
          allowFontScaling={false}
          onFocus={onFocus}
          maxLength={maxLength}
          onBlur={() => {
            setIsFocus(false);
            refTextInput.current?.blur();
            Keyboard.dismiss();
          }}
          ref={refTextInput}
          style={styles(props).textInput}
          onChangeText={text => {
            const newText = mixValidator(text);
            onChangeText && onChangeText(newText);
          }}
          value={value}
        />

        {allowClear && value?.length > 0 && (
          <TouchableOpacity style={styles(props).mainButton} onPress={onClear}>
            <Image
              source={icons.closeGrey}
              style={{
                width: 18,
                height: 18,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontFamily: font.regular,
            fontSize: normalize(16),
            color: colors.grey2,
            marginRight: 16,
          }}>
          ไร่
        </Text>
      </Pressable>
    </>
  );
};
const styles = ({isError, isFocus}: StyleProps) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: isError
        ? colors.decreasePoint
        : isFocus
        ? colors.orange
        : colors.grey3,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 8,
      height: normalize(56),
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 32,
      height: '100%',
      resizeMode: 'contain',
      marginRight: 8,
    },
    textInput: {
      fontFamily: fonts.regular,
      fontSize: 16,
      color: colors.fontBlack,
      flex: 1,
      paddingLeft: 10,
    },
    placeholder: {
      fontFamily: fonts.regular,
      color: colors.grey40,
      fontSize: normalize(16),

      position: 'absolute',
      left: 16,
    },
    mainButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default RaiInput;
