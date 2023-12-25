import {StyleSheet, View} from 'react-native';
import React from 'react';
import {momentExtend} from '../function/utility';
import fonts from '../assets/fonts';
import {normalize} from '../function/Normalize';
import {colors} from '../assets';
import moment from 'moment';
import Text from './Text';

interface MaintenanceProps {
  header: string;
  dateStart: string;
  dateEnd: string;
  text: string;
  footer: string;
}
export const DateTimeMaintenance: React.FC<MaintenanceProps> = ({
  header,
  dateStart,
  dateEnd,
  text,
}) => {
  const sameDay = moment(dateStart).isSame(dateEnd, 'day');

  return (
    <>
      {!sameDay ? (
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{marginTop: 20}}>
              <Text style={styles.fontTitle}>{header}</Text>
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`วันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                    fontSize: normalize(24),
                  }}>
                  {momentExtend.toBuddhistYear(dateStart, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {'ช่วงเวลา '}
                {moment(dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - 23:59 น.'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`ถึงวันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                    fontSize: normalize(24),
                  }}>
                  {momentExtend.toBuddhistYear(dateEnd, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {`ช่วงเวลา 00:00 - `}

                {moment(dateEnd)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm น.')}
              </Text>
              <View style={{marginTop: 20}}>
                <Text style={styles.fontMA}>{text.split(' ')[0]} </Text>
                <Text style={styles.fontMA}>{text.split(' ')[1]} </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{marginTop: 20}}>
              <Text style={styles.fontTitle}>{header}</Text>
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`วันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                    fontSize: normalize(24),
                  }}>
                  {momentExtend.toBuddhistYear(dateStart, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {'ช่วงเวลา '}
                {moment(dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - '}
                {moment(dateEnd).add(543, 'year').locale('th').format('HH.mm')}
                {' น.'}
              </Text>
              <View
                style={{
                  marginTop: 20,
                  width: '100%',
                  alignItems: 'center',
                  paddingHorizontal: 32,
                }}>
                <Text style={styles.fontMA}>{text}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};
export default DateTimeMaintenance;
const styles = StyleSheet.create({
  fontTitle: {
    fontFamily: fonts.medium,
    fontSize: normalize(22),
    color: colors.fontBlack,
    fontWeight: '800',
  },
  fontBody: {
    fontFamily: fonts.regular,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  fontMA: {
    fontFamily: fonts.medium,
    fontSize: normalize(18),
    color: colors.fontBlack,
    marginBottom: 2,
    lineHeight: 30,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
});
