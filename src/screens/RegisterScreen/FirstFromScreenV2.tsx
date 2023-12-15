import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '@rneui/themed';
import {colors, font, icons, image as img} from '../../assets';
import {ProgressBarV2} from '../../components/ProgressBarV2';
import * as ImagePicker from 'react-native-image-picker';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';

import {Register} from '../../datasource/AuthDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';

import Text from '../../components/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import AsyncButton from '../../components/Button/AsyncButton';
import AnimatedInput from '../../components/Input/AnimatedInput';
import {mixValidator} from '../../function/inputValidate';
import InfoCircle from '../../components/InfoCircle';
import {mixpanel} from '../../../mixpanel';

const FirstFormScreenV2: React.FC<any> = ({navigation, route}) => {
  const tele = route.params.tele;
  const [loading, setLoading] = useState(false);
  const [loadingDisableButton, setLoadingDisableButton] = useState(false);
  const [formState, setFormState] = useState<any>({
    firstname: '',
    lastname: '',
    nickname: '',
  });
  const [image, setImage] = useState<any>(null);
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, []);
  return (
    <SafeAreaView style={stylesCentral.container}>
      {/* <View style={styles.inner}> */}
      {/* <View style={styles.container}> */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <CustomHeader
            title="ลงทะเบียนนักบินโดรน"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.container}>
              <View style={{marginBottom: normalize(10)}}>
                <ProgressBarV2 index={1} />
              </View>
              <Text style={styles.label}>ขั้นตอนที่ 1 จาก 2</Text>
              <Text style={styles.h1}>กรอกข้อมูลทั่วไป</Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: normalize(40),
                }}>
                <TouchableOpacity
                  onPress={onAddImage}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      width: normalize(116),
                      height: normalize(116),
                      position: 'relative',
                    }}>
                    <ProgressiveImage
                      source={
                        !image ? icons.account : {uri: image.assets[0].uri}
                      }
                      style={{
                        width: normalize(116),
                        height: normalize(116),
                        borderRadius: normalize(58),
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        left: normalize(70.7),
                        top: normalize(70.7),
                        width: normalize(32),
                        height: normalize(32),
                        borderRadius: normalize(16),
                        backgroundColor: colors.white,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={icons.camera}
                        style={{
                          width: normalize(20),
                          height: normalize(20),
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: normalize(40)}}>
                <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
              </View>
              <AnimatedInput
                stylesInput={{
                  borderRadius: normalize(10),
                }}
                label="ชื่อ"
                onBlur={() => {
                  mixpanel.track('RegisterScreenStepOne_InputFirstName_typed', {
                    firstname: formState.firstname,
                  });
                }}
                onChangeText={value => {
                  const newValue = mixValidator(value);
                  setFormState({
                    ...formState,
                    firstname: newValue,
                  });
                }}
                style={{
                  marginTop: 16,
                }}
                value={formState.firstname}
              />
              <AnimatedInput
                label="นามสกุล"
                stylesInput={{
                  borderRadius: normalize(10),
                }}
                onBlur={() => {
                  mixpanel.track('RegisterScreenStepOne_InputLastName_typed', {
                    lastname: formState.lastname,
                  });
                }}
                onChangeText={value => {
                  const newValue = mixValidator(value);
                  setFormState({
                    ...formState,
                    lastname: newValue,
                  });
                }}
                value={formState.lastname}
              />
              <AnimatedInput
                maxLength={50}
                stylesInput={{
                  borderRadius: normalize(10),
                }}
                onBlur={() => {
                  mixpanel.track('RegisterScreenStepOne_InputNickName_typed', {
                    nickname: formState.nickname,
                  });
                }}
                label={'ชื่อเล่น (ชื่อที่เกษตรเรียก)'}
                suffixPosition={18}
                value={formState.nickname}
                onChangeText={value => {
                  const newValue = mixValidator(value);
                  setFormState({
                    ...formState,
                    nickname: newValue,
                  });
                }}
                suffix={<InfoCircle sheetId="nicknameSheet" />}
              />

              <TextInput
                allowFontScaling={false}
                value={tele}
                style={[styles.input, {backgroundColor: colors.disable}]}
                editable={false}
                placeholder={'เบอร์โทรศัพท์'}
                placeholderTextColor={colors.disable}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: colors.white,
          zIndex: 0,
          margin: normalize(17),
        }}>
        <AsyncButton
          disabled={
            !formState.firstname ||
            !formState.lastname ||
            !formState.nickname ||
            loadingDisableButton
          }
          title="ถัดไป"
          isLoading={loadingDisableButton}
          // onPress={async () => {
          //   setLoading(true);
          //   setLoadingDisableButton(true);
          //   try {
          //     if (Platform.OS === 'ios') {
          //       const result = await Geolocation.requestAuthorization(
          //         'always',
          //       ).catch(() => {
          //         setAllowLoca(true);
          //         setLoading(false);
          //       });
          //       if (result !== 'granted') {
          //         setAllowLoca(true);
          //       }
          //     } else if (Platform.OS === 'android') {
          //       const result = await PermissionsAndroid.request(
          //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          //       ).catch(() => {
          //         setAllowLoca(true);
          //         setLoading(false);
          //       });
          //       if (result !== 'granted') {
          //         setAllowLoca(true);
          //       }
          //     }
          //     Geolocation.getCurrentPosition(position => {
          //       Register.registerStep1V2(
          //         formState.firstname,
          //         formState.lastname,
          //         tele,
          //       )
          //         .then(async res => {
          //           if (!image) {
          //             await AsyncStorage.setItem('droner_id', res.id);
          //             setLoading(false);
          //             setLoadingDisableButton(false);

          //             setTimeout(() => {
          //               navigation.navigate('SecondFormScreenV2', {
          //                 tele: route.params.telNumber,
          //                 latitude: position.coords.latitude,
          //                 longitude: position.coords.longitude,
          //               });
          //             }, 500);
          //           } else {
          //             await Register.uploadProfileImage(image).then(
          //               async () => {
          //                 await AsyncStorage.setItem('droner_id', res.id);
          //                 setLoading(false);
          //                 setLoadingDisableButton(false);
          //                 setTimeout(() => {
          //                   navigation.navigate('SecondFormScreenV2', {
          //                     tele: route.params.telNumber,
          //                     latitude: position.coords.latitude,
          //                     longitude: position.coords.longitude,
          //                   });
          //                 }, 500);
          //               },
          //             );
          //           }
          //         })
          //         .catch(err => console.log(err));
          //     });
          //   } catch (err) {
          //     setAllowLoca(true);
          //     setLoading(false);
          //   } finally {
          //     setLoading(false);
          //   }
          // }}
          onPress={async () => {
            setLoading(true);
            try {
              const res = await Register.registerStep1V2({
                ...formState,
                telephoneNo: tele,
              });
              mixpanel.track('RegisterScreenStepOne', {
                firstname: formState.firstname,
                lastname: formState.lastname,
                nickname: formState.nickname,
                telephoneNo: tele,
              });
              if (!image) {
                await AsyncStorage.setItem('droner_id', res.id);
                setLoading(false);
                setLoadingDisableButton(false);
                setTimeout(() => {
                  navigation.navigate('SecondFormScreenV2', {
                    tele: route.params.telNumber,
                  });
                }, 100);
              } else {
                await Register.uploadProfileImage(image).then(async () => {
                  await AsyncStorage.setItem('droner_id', res.id);
                  setLoading(false);
                  setTimeout(() => {
                    navigation.navigate('SecondFormScreenV2', {
                      tele: route.params.telNumber,
                    });
                  }, 100);
                });
              }
            } catch (err) {
              console.log(err);
            } finally {
              setLoading(false);
            }
          }}
        />
      </View>
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
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

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
    marginBottom: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});

export default FirstFormScreenV2;
