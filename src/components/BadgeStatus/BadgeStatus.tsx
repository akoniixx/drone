import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import Text from '../Text';
import {font} from '../../assets';
import {normalize} from '../../function/Normalize';
const mappingText = {
  DONE_PAYMENT: 'รับเงินแล้ว',
  WAIT_PAYMENT: 'รอรับเงิน',
  WAIT_REVIEW: 'รอริวิว',
};
const mappingTextColor = {
  DONE_PAYMENT: '#014D40',
  WAIT_PAYMENT: '#014D40',
  WAIT_REVIEW: '#4D4B23',
};
const mappingBgColor = {
  DONE_PAYMENT: '#9BF9D3',
  WAIT_PAYMENT: '#F1FAC3',
  WAIT_REVIEW: '#FAF682',
};
export default function BadgeStatus({
  status,
  statusPayment,
  style,
}: {
  status: string;
  statusPayment: string | null;
  style?: ViewStyle;
}) {
  if (!statusPayment || status === 'WAIT_REVIEW') {
    return null;
  }
  if (statusPayment && statusPayment === 'SUCCESS') {
    return null;
  }
  return (
    <View
      style={[
        styles.badge,
        style,
        {
          //   borderColor: mappingBgColor[status as keyof typeof mappingBgColor],
          backgroundColor:
            mappingBgColor[statusPayment as keyof typeof mappingBgColor],
        },
      ]}>
      <Text
        style={{
          fontFamily: font.medium,
          fontSize: normalize(12),
          color:
            mappingTextColor[statusPayment as keyof typeof mappingTextColor],
        }}>
        {mappingText[statusPayment as keyof typeof mappingText]}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(5),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
});
