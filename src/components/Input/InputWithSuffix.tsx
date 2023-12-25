import {
  Pressable,
  StyleSheet,
  TextInputProps,
  TextInput,
  ViewStyle,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import {normalize} from '../../function/Normalize';
interface InputStyledProps {
  isError?: boolean;
  styleContainer?: ViewStyle;
  suffixComponent?: React.ReactNode;
  allowClear?: boolean;
  value?: string;
}
interface Props extends TextInputProps, InputStyledProps {}
export default function InputWithSuffix({
  style,
  styleContainer,
  suffixComponent,
  allowClear = false,
  pointerEvents,
  ...props
}: Props) {
  const refInput = React.useRef<TextInput>(null);
  const isShowClear = allowClear && props.value && props.value?.length > 0;
  return (
    <Pressable
      pointerEvents={pointerEvents}
      style={[styles({allowClear}).container, styleContainer]}
      onPress={() => {
        refInput.current?.focus();
      }}>
      <TextInput
        {...props}
        allowFontScaling={false}
        scrollEnabled={false}
        ref={refInput}
        onBlur={e => {
          props.onBlur && props.onBlur(e);
          refInput.current?.blur();
          Keyboard.dismiss();
        }}
        placeholderTextColor={colors.grey3}
        style={[styles({allowClear}).input, style]}
      />
      {isShowClear && (
        <TouchableOpacity
          onPress={() => {
            refInput.current?.clear();
            props.onChangeText && props.onChangeText('');
          }}
          style={{
            width: 20,
            height: 20,
          }}>
          <Image
            source={icons.closeGrey}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
      )}
      {suffixComponent && suffixComponent}
    </Pressable>
  );
}
const styles = ({allowClear = false}: {allowClear?: boolean}) => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#A7AEB5',
      borderRadius: 10,
      paddingRight: 16,
      paddingLeft: 18,
      height: normalize(56),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.white,
    },
    input: {
      fontSize: 16,
      fontFamily: fonts.medium,
      width: allowClear ? '70%' : '80%',
      height: Platform.OS === 'ios' ? 'auto' : 56,
    },
  });
};
