import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import {SheetManager} from 'react-native-actions-sheet';
import icons from '../../assets/icons/icons';
import {FarmerPlot} from '../../entities/FarmerInterface';

interface Props {
  placeholder?: string;
  label?: string;
  onChange: (v: any) => void;
  value?: any;
  targetSprayData: [];
}
export default function TargetSprayInput({
  label,
  onChange,
  value,
  placeholder,
  targetSprayData,
}: Props) {
  const onShowActionSheet = async () => {
    const result: any = await SheetManager.show('selectTargetSpray', {
      payload: {
        currentValue: value,
      },
    });
    if (result) {
      onChange(result.currentValue);
    }
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
      <TouchableOpacity style={styles.container} onPress={onShowActionSheet}>
        {value ? (
          <Text
            numberOfLines={1}
            style={{
              color: colors.fontBlack,
              fontFamily: font.regular,
              fontSize: normalize(16),
              width: '90%',
            }}>
            {value}
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: normalize(16),
              color: colors.grey2,
            }}>
            {placeholder}
          </Text>
        )}
        <Image
          source={icons.plotsGrey}
          style={{
            width: normalize(24),
            height: normalize(24),
          }}
        />
      </TouchableOpacity>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey3,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    marginBottom: normalize(6),
  },
});
