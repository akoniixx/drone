import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import {SheetManager} from 'react-native-actions-sheet';
import icons from '../../assets/icons/icons';
import {FarmerPlot} from '../../entities/FarmerInterface';
import {PurposeListType} from '../../screens/CreateTaskScreen';

interface Props {
  placeholder?: string;
  label?: string;
  onChange: (v: PurposeListType) => void;
  value?: PurposeListType;
  purposeSprayList: PurposeListType[];
}
export default function PurposeSprayInput({
  label,
  onChange,
  value,
  placeholder,
  purposeSprayList,
}: Props) {
  const onShowActionSheet = async () => {
    const result: {
      currentValue: PurposeListType;
    } = await SheetManager.show('selectPurposeSpray', {
      payload: {
        currentValue: value,
        purposeSprayList: purposeSprayList || [],
      },
    });
    if (result.currentValue) {
      onChange(result.currentValue);
    }
  };
  return (
    <>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.medium,
            marginBottom: normalize(4),
          }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={styles.container}
        disabled={purposeSprayList.length < 1}
        onPress={onShowActionSheet}>
        {value?.purposeSprayName ? (
          <Text
            numberOfLines={1}
            style={{
              color: colors.fontBlack,
              fontFamily: font.regular,
              fontSize: 16,
              width: '90%',
            }}>
            {value.purposeSprayName}
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: 16,
              color: colors.grey2,
            }}>
            {placeholder}
          </Text>
        )}
        <Image
          source={icons.plantPeriod}
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
