import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {image} from '../../assets';
import Text from '../Text';

export default function EmptyGuru() {
  return (
    <View style={styles.container}>
      <Image source={image.emptyGuru} style={styles.image} />
      <Text>ยังไม่มีเนื้อหา</Text>
      <Text>ติดตามความรู้เกษตรได้เร็วๆ นี้</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
  },
});
