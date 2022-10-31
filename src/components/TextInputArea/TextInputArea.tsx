import {View, Text, TextInput, TextInputProps} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import {font} from '../../assets';

interface Props extends TextInputProps {
  label?: string;
}
export default function TextInputArea({label, ...props}: Props) {
  return (
    <View
      style={{
        marginTop: 10,

        width: '100%',
        marginBottom: 8,
      }}>
      {label && (
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(16),
            color: colors.fontBlack,
          }}>
          {label}
        </Text>
      )}
      <TextInput
        multiline
        numberOfLines={4}
        style={[
          {
            minHeight: 40,
            width: '100%',
            padding: normalize(5),
            paddingTop: normalize(10),
            textAlignVertical: 'top',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.grayPlaceholder,
            marginVertical: normalize(10),
          },
          props.style,
        ]}
        {...props}
      />
    </View>
  );
}