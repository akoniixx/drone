import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {image} from '../../assets';
import Text from '../Text';
import colors from '../../assets/colors/colors';

export default function EmptyGuru() {
  return (
    <View style={styles.container}>
      <Image
        source={image.emptyGuru}
        style={styles.image}
        resizeMode="contain"
      />
      <View
        style={{
          height: 10,
        }}
      />
      <Text style={styles.text}>ยังไม่มีเนื้อหา</Text>
      <Text style={styles.text}>ติดตามความรู้เกษตรได้เร็วๆ นี้</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    color: colors.grey2,
  },
});
