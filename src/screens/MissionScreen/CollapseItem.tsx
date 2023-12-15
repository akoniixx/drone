import {View, StyleSheet, Animated, Pressable} from 'react-native';
import React, {useMemo, useRef} from 'react';
import Text from '../../components/Text';

import moment from 'moment';
import {colors, font, icons} from '../../assets';
import {momentExtend, numberWithCommas} from '../../function/utility';
import CardMission from '../../components/CardMission/CardMission';
import {Mission} from './Body';
import {mixpanel} from '../../../mixpanel';
interface Props {
  navigation: any;
  mission: Mission;
}
export default function CollapseItem({navigation, mission}: Props) {
  const isMissionPoint = useMemo(() => {
    return mission.campaignType === 'MISSION_POINT';
  }, [mission.campaignType]);
  const [isCollapse, setIsCollapse] = React.useState<boolean>(true);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const rai = mission.condition[0].allRai;

  const dateStart = moment(mission.startDate).toISOString();
  const isLessThanTenDays =
    moment(mission.endDate).diff(moment(), 'days') <= 10;
  const isLessThanDay = moment(mission.endDate).diff(moment(), 'days') <= 0;

  const animate = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimate = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const isEndMission = moment(mission.endDate).isBefore(moment());

  if (isEndMission) {
    return <View />;
  }

  return (
    <>
      <Pressable
        style={[
          styles.row,
          {
            marginTop: 8,
          },
        ]}
        onPress={() => {
          if (!isCollapse) {
            animate();
          } else {
            resetAnimate();
          }
          setIsCollapse(!isCollapse);
        }}>
        <View
          style={{
            flex: 0.9,
          }}>
          <Text
            title
            style={{
              fontSize: 20,
            }}>
            {mission.campaignName}
          </Text>
          <Text
            style={{
              color: isLessThanTenDays
                ? colors.decreasePoint
                : colors.fontBlack,
            }}>
            {isLessThanDay
              ? `อีก ${moment(mission.endDate).fromNow()} `
              : `อีก ${moment(mission.endDate).diff(moment(), 'days')} วัน`}
          </Text>
        </View>
        <View
          style={{
            flex: 0.1,
            marginTop: 4,
          }}>
          <Animated.Image
            source={icons.arrowUpCollapse}
            style={{
              width: 30,
              height: 30,
              transform: [
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '0deg'],
                  }),
                },
              ],
            }}
          />
        </View>
      </Pressable>

      {isCollapse && (
        <>
          {rai > -1 ? (
            <View style={styles.boxOrange}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 14,
                  }}>
                  จำนวนไร่สะสม
                </Text>
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: font.bold,
                    fontSize: 14,

                    color: colors.orange,
                  }}>
                  {numberWithCommas(rai.toString(), true)} ไร่
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.regular,
                  fontSize: 10,
                  marginTop: 4,
                }}>
                เริ่มนับจำนวนไร่สะสมตั้งแต่{' '}
                {momentExtend.toBuddhistYear(dateStart, 'DD MMM YYYY')} ถึง{' '}
                {momentExtend.toBuddhistYear(mission.endDate, 'DD MMM YYYY')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: 12,
              }}
            />
          )}
          {mission.condition.map(el => {
            const isComplete = el.allRai >= el.rai;
            const current = el.allRai > el.rai ? el.rai : el.allRai;
            const isExpired = moment().isAfter(mission.endDate);
            const isStatusComplete = el.status === 'COMPLETE';

            return (
              <CardMission
                isComplete={isComplete}
                current={current}
                isStatusComplete={isStatusComplete}
                imageSource={el?.reward?.imagePath}
                isExpired={isExpired}
                isMissionPoint={isMissionPoint}
                total={el.rai}
                isDouble={false}
                point={el.point}
                missionName={el.missionName}
                description={
                  el?.reward?.rewardName ? `รับ${el.reward.rewardName}` : null
                }
                isFullQuota={false}
                key={el.num}
                onPress={() => {
                  mixpanel.track('MissionScreen_CardMission_press', {
                    ...el,
                    current,
                    status: el.status,
                    isComplete,
                    isExpired,
                    isStatusComplete,
                    missionName: el.missionName,
                    reward: el.reward,
                    endDate: mission.endDate,
                    total: el.rai,
                    conditionReward: el.conditionReward,
                    descriptionReward: el.descriptionReward,
                    num: el.num,
                    missionId: el.missionId,
                    isMissionPoint,
                    missionPointDetail: el,
                  });
                  navigation.navigate('MissionDetailScreen', {
                    data: {
                      ...el,
                      current,
                      status: el.status,
                      isComplete,
                      isExpired,
                      isStatusComplete,
                      missionName: el.missionName,
                      reward: el.reward,
                      endDate: mission.endDate,
                      total: el.rai,
                      conditionReward: el.conditionReward,
                      descriptionReward: el.descriptionReward,
                      num: el.num,
                      missionId: el.missionId,
                      isMissionPoint,
                      missionPointDetail: el,
                    },
                  });
                }}
              />
            );
          })}
        </>
      )}
      <View
        style={{
          borderBottomWidth: 1,
          paddingBottom: 8,
          borderBottomColor: colors.disable,
          marginBottom: 8,
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  content: {
    paddingVertical: 16,
    height: 100,
  },
  boxOrange: {
    marginVertical: 12,
    flex: 0.9,
    padding: 12,
    backgroundColor: colors.lightOrange,
    borderWidth: 1,
    borderColor: colors.orangeSoft,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    borderRadius: 6,
  },
});
