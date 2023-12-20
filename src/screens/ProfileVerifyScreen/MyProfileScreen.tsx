import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native';
import {normalize} from '../../function/Normalize';
import {colors, font} from '../../assets';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {Register} from '../../datasource/AuthDatasource';
import Text from '../../components/Text';
// import ProgressCircle from 'react-native-progress-circle'

const MyProfileScreen: React.FC<any> = ({navigation}) => {
  const [drone, setDrone] = useState<any>([]);
  const [plants, setPlants] = useState();
  const [checkNum, setCheckNum] = useState<number>(50);
  const [showModal, setShowModal] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const droner_id = await AsyncStorage.getItem('droner_id');
      ProfileDatasource.getProfile(droner_id!).then(res => {
        setLoading(false);
        setDrone(res.dronerDrone);
        setPlants(res.expPlant);
        setCheckNum(res.percentSuccess);
        if (res.dronerDrone[0] && res.expPlant[0]) {
          Register.changeToPending().then(() => {
            setShowModal(true);
          });
        }
      });
    };
    getProfile();
  }, [isFocused]);

  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title={'โปรไฟล์ของคุณ'}
      />
      <View style={[styles.body]}>
        <View
          style={[
            styles.cardProgress,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Image
              source={
                checkNum === 50
                  ? image.inprogress50
                  : checkNum === 75
                  ? image.inprogress75
                  : image.inprogress100
              }
              style={{
                width: normalize(50),
                height: normalize(50),
              }}
            />
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              width: '78%',
            }}>
            <Text style={[styles.textCard]}>
              {
                'ใช้เวลาเพียง 2 นาที กรอกข้อมูลโปรไฟล์ ของคุณให้สมบูรณ์เพื่อเริ่มรับงานบินโดรนในระบบ'
              }
            </Text>
            <View style={[styles.pending]}>
              <Text style={[styles.textPending]}>รอยืนยันตัวตน</Text>
            </View>
          </View>
        </View>
        <View style={{paddingVertical: normalize(12)}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddDroneScreen')}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={drone.length === 0 ? image.num1 : icons.checkOrange}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.text}>เพิ่มโดรน</Text>
              </View>
              <Image
                source={icons.arrowRight}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPlantsScreen')}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={!plants ? image.num2 : icons.checkOrange}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.text}>เพิ่มพืชที่เคยฉีดพ่น</Text>
              </View>
              <Image
                source={icons.arrowRight}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 10,
              width: '100%',
              paddingVertical: normalize(16),
              borderRadius: 12,
              paddingHorizontal: 16,
            }}>
            <View style={{paddingVertical: 20}}>
              <Image
                source={image.regisSuccess}
                style={{
                  width: normalize(180),
                  height: normalize(180),
                  alignSelf: 'center',
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                textAlign: 'center',
                paddingBottom: 2,
                color: colors.fontBlack,
              }}>
              ยินดีด้วย!
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                textAlign: 'center',
                paddingBottom: 20,
                color: colors.fontBlack,
              }}>
              คุณทำโปรไฟล์เสร็จสมบูรณ์แล้ว
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: 2,
                color: colors.fontBlack,
              }}>
              กรุณารอเจ้าหน้าที่ตรวจสอบเอกสารยืนยัน
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: 20,
                color: colors.fontBlack,
              }}>
              บัญชีนักบินโดรนของคุณ เพื่อรับงานบินโดรน
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setTimeout(() => {
                  navigation.navigate('ProfileScreen', {
                    navbar: false,
                  });
                }, 400);
              }}
              style={{
                height: 60,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.orange,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                  fontSize: 20,
                }}>
                ตกลง
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
};
export default MyProfileScreen;
const styles = StyleSheet.create({
  body: {
    flex: 9,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(17),
    color: colors.fontBlack,
  },
  cardProgress: {
    padding: normalize(16),
    borderWidth: 0.5,
    borderRadius: normalize(15),
    borderColor: colors.disable,
  },
  textCard: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
    color: colors.fontBlack,
  },
  text: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    left: 20,
    color: colors.fontBlack,
  },
  number: {
    borderWidth: 1,
    borderRadius: 20,
    width: normalize(20),
    height: 'auto',
    padding: normalize(6),
  },
  listTile: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalize(0.5),
    borderBottomColor: colors.disable,
  },
  pending: {
    backgroundColor: colors.orangeSoft,
    borderRadius: 16,
    padding: normalize(4),
    width: normalize(100),
  },
  textPending: {
    fontSize: normalize(14),
    fontFamily: fonts.bold,
    color: colors.darkOrange2,
    alignSelf: 'center',
  },
});
