import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../Text';
import {colors, font, image} from '../../assets';

type Props = {
  isMain?: boolean;
};

const EmptyFarmerList = ({isMain}: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={image.emptyFarmerList}
        resizeMode="contain"
        style={{
          width: Dimensions.get('window').width / 2,
          height: Dimensions.get('window').width / 2.5,
        }}
      />
      <Text style={styles.text}>
        {isMain ? 'ไม่มีเกษตรที่เคยจ้าง' : 'ไม่พบเกษตรกรที่ค้นหา'}
      </Text>
    </View>
  );
};

export default EmptyFarmerList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: font.medium,
    fontSize: 16,
    color: colors.grey3,
  },
});
