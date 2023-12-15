import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@rneui/themed';
import colors from '../../assets/colors/colors';
import {font, icons, image as img} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import * as ImagePicker from 'react-native-image-picker';
import {Register} from '../../datasource/AuthDatasource';
import {ProgressBar} from '../../components/ProgressBar';
import Lottie from 'lottie-react-native';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';

const width = Dimensions.get('window').width;

const AddIDcardScreen: React.FC<any> = ({route, navigation}) => {
  const telNo = route.params.tele;
  const Profile = route.params.profile;
  const width = Dimensions.get('window').width;
  const [image, setImage] = useState<any>(null);
  const [idcard, setIdCard] = useState<any>('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title={Profile ? 'ส่งเอกสารเพิ่มเติม' : 'ลงทะเบียนนักบินโดรน'}
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View>
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
            <ScrollView>
              <View style={{paddingTop: 20}}>
                <Text style={styles.h2}>รูปถ่ายผู้สมัคร คู่บัตรประชาชน</Text>
                <TouchableOpacity
                  style={{
                    marginVertical: 20,
                  }}
                  onPress={onAddImage}>
                  {image == null ? (
                    <View style={styles.addImage}>
                      <View style={styles.camera}>
                        <Image
                          source={icons.camera}
                          style={{
                            width: 19,
                            height: 16,
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: width * 0.9,
                        height: normalize(162),
                        borderRadius: 20,
                        position: 'relative',
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: colors.white,
                          borderRadius: 12,
                          padding: 10,
                          height: 38,
                          zIndex: 3,
                        }}>
                        <Text style={styles.h3}>เปลี่ยนรูป</Text>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: width * 0.9,
                          height: normalize(162),
                          borderRadius: 20,
                          zIndex: 0,
                        }}>
                        <Image
                          source={{uri: image.assets[0].uri}}
                          style={{
                            width: width * 0.9,
                            height: normalize(162),
                            borderRadius: 20,
                          }}
                        />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  placeholder="เลขบัตรประชาชน"
                  maxLength={13}
                  keyboardType={'number-pad'}
                  onChangeText={value => {
                    setIdCard(value);
                  }}
                />
                <Text style={[styles.h3, {color: colors.gray}]}>
                  ใส่เลข 13 หลักโดยไม่ต้องเว้นวรรค
                </Text>
              </View>
            </ScrollView>
          </View>
          <MainButton
            label="ยืนยันการสมัคร"
            color={
              idcard.length === 13 && image != null
                ? colors.orange
                : colors.disable
            }
            disable={idcard.length === 13 && image != null ? false : true}
            onPress={() => {
              if (idcard.length === 13 && image != null) {
                if (Profile) {
                  setLoading(true);
                  ProfileDatasource.addIdCard(idcard)
                    .then(() => {
                      ProfileDatasource.uploadDronerIDCard(image)
                        .then(() => {
                          setLoading(false);
                          navigation.navigate('MainScreen');
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
                } else {
                  setOpenModal(true);
                }
              }
            }}
          />
          <Modal transparent={true} visible={openModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: normalize(20),
                  backgroundColor: colors.white,
                  width: width * 0.9,
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: normalize(8),
                }}>
                <Text style={[styles.h2, {textAlign: 'center'}]}>
                  คุณต้องการยืนยันการสมัครใช่ไหม?
                </Text>
                <Text
                  style={[
                    styles.label,
                    {textAlign: 'center', marginVertical: 5},
                  ]}>
                  กรุณาตรวจสอบรายละเอียดการสมัครสมาชิก ของคุณให้ครบถ้วน
                  หากมีการข้ามบางขั้นตอน
                  ในการสมัครอาจทำให้ใช้งานระบบได้เพียงบางส่วน?
                </Text>
                <MainButton
                  label="ถัดไป"
                  color={colors.orange}
                  onPress={() => {
                    mixpanel.track('Add ID card');
                    setOpenModal(false);
                    setLoading(true);
                    Register.registerStep4(telNo, idcard)
                      .then(() => {
                        Register.uploadDronerIDCard(image)
                          .then(() => {
                            setLoading(false);
                            navigation.navigate('SuccessScreen');
                          })
                          .catch(err => console.log(err));
                      })
                      .catch(err => console.log(err));
                  }}
                />
                <MainButton
                  label="ย้อนกลับ"
                  fontColor={colors.fontBlack}
                  color={colors.white}
                  onPress={() => {
                    setOpenModal(false);
                  }}
                />
              </View>
            </View>
          </Modal>
          <Modal transparent={true} visible={loading}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.white,
                  width: normalize(50),
                  height: normalize(50),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: normalize(8),
                }}>
                <Lottie
                  source={img.loading}
                  autoPlay
                  loop
                  style={{
                    width: normalize(50),
                    height: normalize(50),
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(17),
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
  addImage: {
    width: width * 0.9,
    height: normalize(162),
    borderColor: '#EBEEF0',
    borderWidth: 0.5,
    backgroundColor: '#FAFAFB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
  camera: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
export default AddIDcardScreen;
