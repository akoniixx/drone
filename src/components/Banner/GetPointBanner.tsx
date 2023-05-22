import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';
import { image } from '../../assets';
import fonts from '../../assets/fonts';

export default function Banner() {
  return (
    <ImageBackground source={image.bgGetPoint} style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.medium,
          }}>
          ท่านจะได้รับคะแนนหลังจากรีวิวงาน
        </Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingVertical: 8,
  },
});