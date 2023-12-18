import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '@rneui/themed';
import {colors, font, image} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import {ProgressBar} from '../../components/ProgressBar';
import {Register} from '../../datasource/AuthDatasource';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';

const width = Dimensions.get('window').width;

const FourthFormScreen: React.FC<any> = ({route, navigation}) => {
  const telNo = route.params.tele;
  const Profile = route.params.profile ?? false;
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={Profile ? 'ส่งเอกสารเพิ่มเติม' : 'ลงทะเบียนนักบินโดรน'}
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.inner}>
          {Profile ? (
            <></>
          ) : (
            <>
              <View style={{marginBottom: normalize(10)}}>
                <ProgressBar index={4} />
              </View>
              <Text style={styles.label}>ขั้นตอนที่ 4 จาก 4</Text>
              <Text style={styles.h1}>ยืนยันเอกสาร</Text>
            </>
          )}
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: normalize(20),
            }}>
            <Text style={styles.h1}>
              {Profile ? 'ยืนยันตัวตนนักบินโดรน' : 'ขั้นตอนสุดท้าย!'}
            </Text>
            <Text
              style={[
                styles.h2,
                {color: colors.gray, paddingVertical: normalize(8)},
              ]}>
              ยืนยันตัวตน ด้วยรูปถ่ายคู่ผู้สมัคร พร้อมบัตรประชาชน
            </Text>
            <Image
              source={image.idcard}
              style={{
                width: width * 0.6,
                height: width * 0.6,
                marginVertical: normalize(20),
              }}
            />
            <Text style={styles.h3}>กรุณาถ่ายหน้าตรง</Text>
            <Text style={styles.h3}>
              พร้อมถือบัตรประชาชนของคุณโดยให้เห็นใบหน้าชัดเจน
            </Text>
            <Text style={styles.h3}>และบัตรประชาชนอย่างชัดเจน</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: normalize(17)}}>
        <MainButton
          label="ถัดไป"
          color={colors.orange}
          onPress={() => {
            mixpanel.track('กดไปยังหน้าอัปโหลดเอกสาร');
            navigation.navigate('AddIDCardScreen', {
              tele: telNo,
              profile: Profile,
            });
          }}
        />
        {Profile ? (
          <></>
        ) : (
          <MainButton
            label="ข้ามขั้นตอนนี้"
            color={colors.white}
            fontColor={colors.fontBlack}
            onPress={() => {
              mixpanel.track('กดข้ามหน้าอัปโหลดเอกสาร');
              Register.registerSkipStep4()
                .then(() => navigation.navigate('SuccessScreen'))
                .catch(err => console.log(err));
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(17),
    // alignItems : 'center'
  },
  page4: {
    width: width * 0.9,
    height: normalize(79),
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: normalize(16),
    backgroundColor: '#FFFBF7',
    paddingHorizontal: normalize(30),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: colors.orange,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    backgroundColor: '#FFFBF7',
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
  },
  h3: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
  },
});

export default FourthFormScreen;
