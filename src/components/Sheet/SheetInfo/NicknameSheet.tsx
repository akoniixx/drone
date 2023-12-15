import {StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../Text';
import {font} from '../../../assets';

export default function NicknameSheet() {
  return (
    <View style={styles.content}>
      <Text style={styles.h1}>ชื่อเล่น คืออะไร?</Text>
      <Text style={styles.h3}>
        {`คือ ชื่อเล่น หรือ \n ชื่อที่ทำให้เกษตรกรจดจำและนึกถึงคุณได้ดียิ่งขึ้น \n เมื่อต้องการจ้างงาน`}
      </Text>
      <Text style={styles.h3}>
        {`โดยชื่อนี้แสดงผลผ่านแอปฯ เรียกนักบิน (ฝั่งเกษตรกร)`}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
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
