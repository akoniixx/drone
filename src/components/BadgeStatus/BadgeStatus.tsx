import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import Text from '../Text';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import icons from '../../assets/icons/icons';
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

const mappingStatusInProgress = {
  WAIT_APPROVE: 'รอขยายเวลา',
  APPROVED: 'ขยายเวลาแล้ว',
  REJECTED: 'ไม่อนุมัติขยายเวลา',
  EXTENDED: 'ขยายเวลาแล้ว',
};
const mappingStatusInProgressColor = {
  WAIT_APPROVE: colors.orange,
  APPROVED: '#2EC66E',
  REJECTED: '#E85737',
  EXTENDED: '#2EC66E',
};

const mappingStatusIcon = {
  WAIT_APPROVE: icons.waitExtendTask,
  APPROVED: icons.extendedTask,
  REJECTED: icons.rejectExtendTask,
  EXTENDED: icons.waitExtendTask,
};

export default function BadgeStatus({
  status,
  statusPayment,
  style,
  statusDelay,
}: {
  status: string;
  statusPayment: string | null;
  style?: ViewStyle;
  statusDelay: 'WAIT_APPROVE' | 'APPROVED' | 'REJECTED' | 'EXTENDED' | null;
}) {
  if (status === 'IN_PROGRESS' && statusDelay) {
    return (
      <View
        style={[
          styles.badge,
          style,
          {
            backgroundColor:
              mappingStatusInProgressColor[
                statusDelay as keyof typeof mappingStatusInProgressColor
              ],
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <Image
          source={
            mappingStatusIcon[statusDelay as keyof typeof mappingStatusIcon]
          }
          style={{
            width: 12,
            height: 12,
            marginRight: 4,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(12),
            color: colors.white,
          }}>
          {
            mappingStatusInProgress[
              statusDelay as keyof typeof mappingStatusInProgress
            ]
          }
        </Text>
      </View>
    );
  }

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
