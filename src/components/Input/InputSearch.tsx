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
import {icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {mixValidator} from '../../function/inputValidate';
import Text from '../Text';
import AsyncButton from '../Button/AsyncButton';
import {Animated} from 'react-native';

type Props = {
  isError?: boolean;
  style?: ViewStyle;
  showButton?: boolean;
  onPressButton?: () => void;
  titleButton?: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  allowClear?: boolean;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
  disableButton?: boolean;
  errorText?: string;
  lineError?: number;
};

type StyleProps = {
  isFocus?: boolean;
} & Props;

const InputSearch = ({
  value = '',
  onChangeText,
  placeholder,
  showButton = false,
  onPressButton,
  titleButton = 'ค้นหา',
  allowClear = true,
  maxLength,
  disableButton = false,
  errorText = '',
  lineError = 2,
  ...props
}: Props) => {
  const [isFocus, setIsFocus] = React.useState(false);
  const refTextInput = React.useRef<TextInput>(null);
  const [heightAnim] = React.useState(new Animated.Value(0));
  const onFocus = () => {
    setIsFocus(true);
    if (refTextInput.current) {
      refTextInput.current?.focus();
    }
  };
  const onClear = () => {
    onChangeText && onChangeText('');
  };
  React.useEffect(() => {
    if (errorText.length > 0) {
      // Expand
      Animated.timing(heightAnim, {
        toValue: 25 * lineError, // Assuming 30 is the height of your error message
        duration: 300,
        useNativeDriver: false, // height does not support native driver
      }).start();
    } else {
      // Collapse
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorText]);
  return (
    <>
      <Pressable
        onPress={onFocus}
        style={[
          styles({
            isError: props.isError,
            isFocus,
          }).container,
          props.style,
        ]}>
        <Image source={icons.searchGrey} style={styles(props).icon} />
        {placeholder && value?.length < 1 && (
          <Text style={styles(props).placeholder}>{placeholder}</Text>
        )}
        <TextInput
          keyboardType={props.keyboardType || 'default'}
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
        {showButton && (
          <AsyncButton
            title={titleButton}
            onPress={() => {
              refTextInput.current?.blur();
              onPressButton?.();
            }}
            styleText={{
              fontSize: 14,
              fontFamily: fonts.bold,
              color: colors.white,
            }}
            disabled={value?.length < 1 || disableButton}
            style={{
              width: 'auto',
              height: 'auto',
              minHeight: '100%',
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          />
        )}
      </Pressable>
      <Animated.View
        style={{
          height: heightAnim, // Bind height to animated value
          overflow: 'hidden', // Hide content when container collapses
          width: '100%',
          flexWrap: 'wrap',
        }}>
        {errorText?.length > 0 ? (
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              marginTop: 4,
              alignSelf: 'flex-start',
              color: colors.decreasePoint,
              flexShrink: 1,
            }}>
            {errorText}
          </Text>
        ) : null}
      </Animated.View>
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
        : colors.disable,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 8,
      height: 52,
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
    },
    placeholder: {
      fontFamily: fonts.regular,
      color: colors.grey40,
      fontSize: 16,
      position: 'absolute',
      left: 48,
    },
    mainButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default InputSearch;
