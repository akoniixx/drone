import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
import Text from '../Text';

interface WaitStartProp {
  mainFunc: () => void;
  togleModal: () => void;
  disable: boolean;
}

export const WaitStartFooter: React.FC<WaitStartProp> = ({
  mainFunc,
  togleModal,
  disable,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, {paddingBottom: 10}]}>
      <TouchableOpacity
        style={[
          styles.startButton,
          {backgroundColor: disable ? colors.disable : colors.primaryBlue},
        ]}
        disabled={disable}
        onPress={() => mainFunc()}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.white,
          }}>
          เริ่มทำงาน
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => togleModal()}
        style={{
          width: 52,
          height: 52,
          backgroundColor: colors.darkBlue,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: normalize(8),
        }}>
        <Image
          source={icons.callSolid}
          style={{width: normalize(20), height: normalize(20)}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    width: normalize(275),
    height: normalize(52),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
