import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {font, icons, image} from '../../assets';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';

interface guruData {
  background: any;
}
export const CardGuruKaset: React.FC<guruData> = ({background}) => {
  return (
    <View
      style={{
        padding: normalize(10),
      }}>
      <View style={styles.card}>
        <ProgressiveImage
          style={{height: normalize(120), borderRadius: 10}}
          source={{uri: background}}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(30),
    borderWidth: 0.3,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  text: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.gray,
    lineHeight: 24,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.regular,
    color: colors.gray,
    lineHeight: 24,
  },
});
