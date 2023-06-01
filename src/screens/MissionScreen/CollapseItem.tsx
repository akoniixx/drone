import {View, StyleSheet, Animated, Pressable} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Text from '../../components/Text';

import moment from 'moment';
import {colors, font, icons} from '../../assets';
import {momentExtend, numberWithCommas} from '../../function/utility';
import CardMission from '../../components/CardMission/CardMission';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';
interface Props {
  navigation: any;
}
export default function CollapseItem({navigation}: Props) {
  const [isCollapse, setIsCollapse] = React.useState<boolean>(true);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const rai = 600;
  const dateEnd = moment().add(4, 'days').toISOString();
  const dateStart = moment().toISOString();
  const isLessThanTenDays = moment(dateEnd).diff(moment(), 'days') <= 10;
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
            บินปั๊บรับแต้ม ลุ้นโชคชั้นที่ 2 ลุ้นโชคชั้นที่ 2 (1/4)
          </Text>
          <Text
            style={{
              color: isLessThanTenDays
                ? colors.decreasePoint
                : colors.fontBlack,
            }}>
            อีก {moment(dateEnd).fromNow()}
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
                fontFamily: font.light,
                fontSize: 10,
                marginTop: 4,
              }}>
              เริ่มนับจำนวนไร่สะสมตั้งแต่{' '}
              {momentExtend.toBuddhistYear(dateStart, 'DD MMM YYYY')} ถึง{' '}
              {momentExtend.toBuddhistYear(dateEnd)}
            </Text>
          </View>
          <CardMission
            onPress={() => navigation.navigate('MissionDetailScreen')}
          />
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