import {Text as TextRN, TextProps, StyleSheet} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';

interface Props extends TextProps {
  title?: boolean;
}
const Text = React.forwardRef<TextRN, Props>(({children, ...props}, ref) => {
  return (
    <TextRN
      {...props}
      ref={ref}
      style={[styles(props).text, props.style]}
      allowFontScaling={false}>
      {children}
    </TextRN>
  );
});
export default Text;
const styles = ({...rest}: Props) => {
  return StyleSheet.create({
    text: {
      fontFamily: rest.title ? font.semiBold : font.light,
      color: colors.fontBlack,
      fontSize: rest.title ? 24 : 16,
    },
  });
};
