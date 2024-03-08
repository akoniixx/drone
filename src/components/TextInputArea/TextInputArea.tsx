import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import {font} from '../../assets';
import {containsEmoji, mixValidator} from '../../function/inputValidate';

interface Props extends TextInputProps {
  label?: string;
  placeholder?: string;
}
export default function TextInputArea({label, style, ...props}: Props) {
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
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          textAlignVertical="top"
          multiline
          allowFontScaling={false}
          numberOfLines={4}
          blurOnSubmit
          style={[
            {
              minHeight: Platform.OS === 'ios' ? 4 * 20 : 4 * 20,
              width: '100%',
              padding: normalize(5),
              paddingTop: normalize(12),
              textAlignVertical: 'top',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.grayPlaceholder,
              marginVertical: normalize(10),
              fontFamily: font.regular,
            },
            style,
          ]}
          {...props}
          onChangeText={text => {
            if (text.length === 1 && text === ' ') {
              return;
            }

            if (containsEmoji(text)) {
              text = text.replace(/[\uD800-\uDFFF]./g, '');
            }

            props.onChangeText && props.onChangeText(text);
          }}
        />
      </ScrollView>
    </View>
  );
}
