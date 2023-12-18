import {View, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {InputPhone} from '../../components/InputPhone';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import * as ImagePicker from 'react-native-image-picker';
import Text from '../../components/Text';

const FirstFormScreen: React.FC<any> = ({navigation, route}) => {
  const progress = [1, 2, 3, 4];
  const [response, setResponse] = React.useState<any>(null);
  const tele = route.params.tele;
  /*  const onButtonPress = React.useCallback(() => {

      ImagePicker.launchImageLibrary(options, setResponse);

  }, []); */
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={1} />
          </View>
          <Text style={styles.label}>ขั้นตอนที่ 1 จาก 4</Text>
          <Text style={styles.h1}>เตรียมเอกสารลงทะเบียน</Text>
          <ScrollView>
            <Text style={[styles.h1, {marginTop: normalize(39)}]}>
              โปรดเตรียมเอกสารดังต่อไปนี้ให้พร้อม
            </Text>
            <Text style={styles.h2}>
              1. รูปถ่ายคู่ผู้สมัคร พร้อมบัตรประชาชน
            </Text>
            <View style={{marginTop: normalize(16), alignItems: 'center'}}>
              <Image
                source={image.idcard}
                style={{width: normalize(122), height: normalize(120)}}
              />
            </View>
            {/* <Text style={styles.h2}>2. ใบอนุญาตนักบิน</Text>
            <View style={{marginTop: normalize(16), alignItems: 'center'}}>
              <Image
                source={image.pirotcer}
                style={{width: normalize(136), height: normalize(176)}}
              />
            </View>
            <Text style={styles.h2}>
              3. ใบรับรองการขึ้นทะเบียนโดรนจาก กสทช.
            </Text>
            <View style={{marginTop: normalize(16), alignItems: 'center'}}>
              <Image
                source={image.dronecer}
                style={{width: normalize(136), height: normalize(192)}}
              />
            </View> */}
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white}}>
          <MainButton
            label="ถัดไป"
            color={colors.orange}
            onPress={() =>
              navigation.navigate('SecondFormScreen', {tele: tele})
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FirstFormScreen;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.medium,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
});
