import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import {StyleSheet, View} from 'react-native';
import React from 'react';

import NicknameSheet from './NicknameSheet';
import {font} from '../../../assets';
import AsyncButton from '../../Button/AsyncButton';

export default function SheetInfo({sheetId}: SheetProps) {
  return (
    <ActionSheet
      id={sheetId}
      safeAreaInsets={{bottom: 0, top: 0, left: 0, right: 0}}
      useBottomSafeAreaPadding={false}
      containerStyle={{
        height: 330,
      }}>
      <View style={styles.container}>
        <NicknameSheet />
        <AsyncButton
          title="เข้าใจแล้ว"
          onPress={() => {
            SheetManager.hide(sheetId);
          }}
        />
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    fontSize: 22,
    fontFamily: font.semiBold,
    lineHeight: 30,
    marginBottom: 16,
  },
  h3: {
    fontSize: 18,
    fontFamily: font.regular,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
});
