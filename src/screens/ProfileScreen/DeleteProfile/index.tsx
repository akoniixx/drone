import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../../styles/StylesCentral';
import {colors, font, icons} from '../../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal/dist/modal';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {callCenterDash} from '../../../definitions/callCenterNumber';
import fonts from '../../../assets/fonts';
import {normalize} from '../../../function/Normalize';
import CustomHeader from '../../../components/CustomHeader';
import {TaskDatasource} from '../../../datasource/TaskDatasource';
import {Authentication} from '../../../datasource/AuthDatasource';
import {MainButton} from '../../../components/Button/MainButton';
import {StackNativeScreenProps} from '../../../navigations/MainNavigator';
import {useAuth} from '../../../contexts/AuthContext';
import Text from '../../../components/Text';
import {mixpanel} from '../../../../mixpanel';

type DeleteProfileScreenProps = StackNativeScreenProps<'DeleteProfileScreen'>;

const DeleteProfile: React.FC<DeleteProfileScreenProps> = ({navigation}) => {
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [task, setTask] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);
  const {
    state: {user},
  } = useAuth();
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
      TaskDatasource.getTaskById(
        droner_id,
        ['WAIT_START', 'IN_PROGRESS'],
        1,
        999,
      )
        .then(res => {
          if (res !== undefined) {
            setTask(res);
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    };
    getData();
  }, []);

  const requestOtp = async () => {
    setToggleModal(false);
    try {
      const data = await Authentication.genOtpDeleteAccount(
        user?.telephoneNo || '',
      );
      mixpanel.track('DeleteProfileScreen_RequestOTP_Press');
      navigation.navigate('VerifyOTP', {
        telNumber: user?.telephoneNo,
        ...data.result,
      });
    } catch (e) {
      console.log(e);
    }

    // const droner_id = await AsyncStorage.getItem('droner_id');
    // ProfileDatasource.deleteAccount(droner_id!)
    //   .then(res => {
    //     setLoading(false);
    //     setToggleModal(false);
    //     onLogout();
    //     RootNavigation.navigate('Auth', {
    //       screen: 'HomeScreen',
    //     });
    //   })
    //   .catch(err => {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'ขออภัยระบบขัดข้อง กรุณาลองอีกครั้ง',
    //     });
    //     setLoading(false);
    //     console.log(err);
    //   });
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลบโปรไฟล์"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('DeleteProfileScreen_BackPress_Press');
          navigation.goBack();
        }}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: normalize(16),
                  color: 'black',
                  textAlign: 'center',
                }}>
                เงื่อนไขการลบบัญชี
              </Text>
            </View>
            <View style={{marginTop: normalize(10)}}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'black',
                  textAlign: 'center',
                }}>
                หากคุณมีงานที่กำลังดำเนินการ หรือรอเริ่มงาน
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'black',
                  textAlign: 'center',
                }}>
                คุณจะไม่สามารถลบบัญชีของคุณได้
              </Text>
            </View>

            <View style={{marginTop: normalize(60)}}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: colors.orange,
                  textAlign: 'center',
                }}>
                หากคุณมีปัญหาในการใช้งาน
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: colors.orange,
                  textAlign: 'center',
                }}>
                คุณสามารถติดต่อเจ้าหน้าที่ โทร.
                {callCenterDash()}
              </Text>
            </View>
          </ScrollView>

          <View
            style={{
              marginBottom: 16,
            }}>
            <MainButton
              label="ลบบัญชี"
              disable={task?.length > 0}
              color={colors.darkOrange}
              fontColor={'white'}
              onPress={() => setToggleModal(!toggleModal)}
            />
          </View>
        </View>
      </View>
      <Modal isVisible={toggleModal}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={icons.trashBlack}
              style={{
                width: 24,
                height: 24,
                marginBottom: 8,
              }}
            />
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(18),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ยืนยันการลบบัญชี
            </Text>
            <Text
              style={{
                fontFamily: font.regular,
                fontSize: normalize(14),
                color: colors.inkLight,
                textAlign: 'center',
              }}>
              คำขอจะถูกส่งไปยังเจ้าหน้าที่
            </Text>
            <Text
              style={{
                fontFamily: font.regular,
                fontSize: normalize(14),
                color: colors.inkLight,
                textAlign: 'center',
              }}>
              และบัญชีของคุณจะถูกลบอย่างถาวร
            </Text>
            <View style={{marginTop: 8}}>
              <Text
                style={{
                  fontFamily: font.regular,
                  fontSize: normalize(14),
                  color: colors.inkLight,
                  textAlign: 'center',
                }}>
                มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
              </Text>
              <Text
                style={{
                  fontFamily: font.regular,
                  fontSize: normalize(14),
                  color: colors.inkLight,
                  textAlign: 'center',
                }}>
                โทร. {callCenterDash()}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 16,
            }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                backgroundColor: colors.darkOrange,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 8,
              }}
              onPress={requestOtp}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'white',
                }}>
                ยืนยันการลบบัญชี
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 8,
                borderWidth: 0.5,
                borderColor: colors.inkLight,
              }}
              onPress={() => setToggleModal(!toggleModal)}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'black',
                }}>
                ยกเลิก
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
export default DeleteProfile;

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
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});
