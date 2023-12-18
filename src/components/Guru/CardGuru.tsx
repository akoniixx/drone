import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {font, icons, image} from '../../assets';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';
import Text from '../Text';

interface guruData {
  index: any;
  background: any;
  title: any;
  date: any;
  read: any;
  isPinned?: boolean;
}
export const CardGuru: React.FC<guruData> = ({
  index,
  background,
  title,
  date,
  read,
  isPinned = false,
}) => {
  return (
    <View
      key={index}
      style={{
        alignSelf: 'center',
        paddingVertical: 5,
      }}>
      <View style={styles.card}>
        <ProgressiveImage
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{height: normalize(128)}}
          source={background === '' ? image.loading : {uri: background}}
        />
        <View style={{paddingHorizontal: 15, top: 15}}>
          <Text style={styles.text} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 16,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.textDate} numberOfLines={1}>
              {date}
            </Text>
            <Text style={[styles.textDate, {left: 15}]} numberOfLines={1}>
              {'อ่านแล้ว ' + read + ' ครั้ง'}
            </Text>
          </View>
          {isPinned && (
            <Image
              style={{
                width: 16,
                height: 16,
              }}
              source={icons.pin}
            />
          )}
        </View>
      </View>
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
  text: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.fontBlack,
    lineHeight: 24,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.regular,
    color: colors.fontBlack,
    lineHeight: 24,
  },
});
