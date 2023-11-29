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
  campaign?: {
    campaignName: string;
  };
}
export const PendingPoint: React.FC<guruData> = ({
  index,
  date,
  point,
  action,
  taskNo = '',
}) => {
  return (
    <View key={index}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.title} numberOfLines={2}>
            {action}
          </Text>
          <Text style={styles.textDate}>{'#' + taskNo}</Text>
        </View>

        <View>
          <Text style={styles.positive}>{`≈${numberWithCommas(
            point.toString(),
            true,
          )}`}</Text>
          <Text style={styles.textDate}>
            {momentExtend.toBuddhistYear(date, 'DD MMM YY HH:mm น.')}
          </Text>
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
    fontFamily: font.bold,
    color: colors.grey2,
    lineHeight: 26,
  },
  positive: {
    fontSize: normalize(17),
    fontFamily: font.bold,
    color: colors.grey3,
    lineHeight: 26,
    textAlign: 'right',
  },
  negative: {
    fontSize: normalize(18),
    fontFamily: font.bold,
    color: colors.redPrice,
    lineHeight: 26,
  },
});
