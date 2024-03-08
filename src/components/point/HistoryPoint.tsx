import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import {momentExtend, numberWithCommas} from '../../function/utility';
import {normalize} from '../../function/Normalize';
import Text from '../Text';

interface guruData {
  index: any;
  date: any;
  point: string;
  action: any;
  taskId: any;
  taskNo: any;
  campaignName: string;
  rewardId: string;
  rewardName: string;
  redeemNo: string;
  redeemDetail: {
    redeemNo: string;
  };
  isSpecialPointDroner?: boolean;
  campaign?: {
    campaignName: string;
  };
  mission?: {
    missionType: string;
    missionNo: string;
  } | null;
}
export const HistoryPoint: React.FC<guruData> = ({
  index,
  date,
  point,
  action,
  taskNo,
  campaignName,
  isSpecialPointDroner = false,
  mission,
  ...props
}) => {
  const isHaveReward = useMemo(() => {
    if (props.rewardId !== null) {
      return true;
    }
  }, [props.rewardId]);
  const {title} = useMemo(() => {
    let title = '';
    if (isSpecialPointDroner) {
      if (action === 'INCREASE') {
        title = campaignName;
      } else if (action === 'RETURN_REVERT') {
        title = `แต้มถูกยกเลิก ${campaignName}`;
      }
    } else {
      if (action === 'INCREASE') {
        title =
          mission?.missionType === 'MISSION_POINT'
            ? campaignName
            : 'รับงานบินโดรนเกษตร';
      } else if (action === 'RETURN') {
        title = 'ได้รับแต้มคืน';
      } else if (action === 'DECREASE' && isHaveReward) {
        title = `แลก ${props.rewardName}`;
      } else if (action === 'RETURN_REVERT') {
        title = 'แต้มถูกยกเลิก จากงานบินโดรนเกษตร';
      }
    }
    return {
      title,
    };
  }, [
    action,
    isSpecialPointDroner,
    mission,
    isHaveReward,
    campaignName,
    props.rewardName,
  ]);

  const codeNo = useMemo(() => {
    if (mission && mission?.missionType === 'MISSION_POINT') {
      return mission?.missionNo;
    }
    return taskNo || '-';
  }, [taskNo, mission]);
  return (
    <View key={index}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>
        <View style={{flex: 0.6}}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.textDate}>
            {/* {taskNo ? '#' : '#'} */}
            {action === 'RETURN'
              ? props?.redeemDetail?.redeemNo || '-'
              : isHaveReward
              ? props.redeemNo
              : codeNo}
          </Text>
        </View>
        <View style={{flex: 0.4}}>
          {action === 'INCREASE' || action === 'RETURN' ? (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text style={styles.positive}>{`+${numberWithCommas(
                point,
                true,
              )} `}</Text>
              <Text style={styles.textDate}>
                {momentExtend.toBuddhistYear(date, 'DD MMM YY HH:mm น.')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text style={styles.negative}>{`-${numberWithCommas(
                point,
                true,
              )} `}</Text>
              <Text style={styles.textDate}>
                {momentExtend.toBuddhistYear(date, 'DD MMM YY HH:mm น.')}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.Surface,
          paddingVertical: 0.5,
          width: '95%',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(35),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#C0C5CA',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  title: {
    fontSize: normalize(16),
    fontFamily: font.medium,
    fontWeight: '600',
    color: colors.fontGrey,
    lineHeight: 26,
  },
  textDate: {
    fontSize: normalize(14),
    fontFamily: font.regular,
    color: colors.gray,
    lineHeight: 26,
  },
  positive: {
    fontSize: normalize(18),
    fontFamily: font.bold,
    color: colors.green,
    lineHeight: 26,
  },
  negative: {
    fontSize: normalize(18),
    fontFamily: font.bold,
    color: colors.redPrice,
    lineHeight: 26,
  },
});
