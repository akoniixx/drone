import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../assets/colors/colors';
import CustomHeader from '../../components/CustomHeader';
import {font, icons, image as img} from '../../assets';
import {normalize, width} from '../../function/Normalize';
import {MainButton} from '../../components/Button/MainButton';
import * as ImagePicker from 'react-native-image-picker';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {Register} from '../../datasource/AuthDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import Text from '../../components/Text';

const IDCardScreen: React.FC<any> = ({navigation}) => {
  const [telNo, setTelNo] = useState<any>(null);
  const width = Dimensions.get('window').width;
  const [image, setImage] = useState<any>(null);
  const [idcard, setIdCard] = useState<any>('');
  const [imgCard, setImgCard] = useState<any>('');
  const [idNo, setId] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [percentSuccess, setPercentSuccess] = useState<any>();

  useEffect(() => {
    const getProfile = async () => {
      const droner_id = await AsyncStorage.getItem('droner_id');
      ProfileDatasource.getProfile(droner_id!).then(res => {
        setTelNo(res.telephoneNo);
        setPercentSuccess(res.percentSuccess);
        setId(res.idNo);
        if (res.file) {
          ProfileDatasource.getImgePath(droner_id!, res.file[0].path).then(
            res => {
              setImgCard(res.url);
            },
          );
        }
      });
    };
    getProfile();
  }, []);
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="เพิ่มรูปคู่บัตรประชาขน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          keyboardVerticalOffset={100}
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
          <View style={styles.inner}>
            <View style={{paddingVertical: 20}}>
              <Text style={styles.text}>
                ตัวอย่างรูปถ่ายคู่ผู้สมัครพร้อมบัตรประชาชน
              </Text>
              <View style={{paddingVertical: 30}}>
                <Image
                  source={img.idcard}
                  style={{
                    width: 250,
                    height: 250,
                    alignSelf: 'center',
                  }}
                />
              </View>
              <Text
                style={[
                  styles.text,
                  {fontFamily: font.regular, alignContent: 'center'},
                ]}>
                กรุณาถ่ายหน้าตรง
              </Text>
              <Text
                style={[
                  styles.text,
                  {fontFamily: font.regular, alignContent: 'center'},
                ]}>
                พร้อมถือบัตรประชาชนของคุณโดยให้เห็นใบหน้า
              </Text>
              <Text
                style={[
                  styles.text,
                  {fontFamily: font.regular, alignContent: 'center'},
                ]}>
                และบัตรประชาชนอย่างชัดเจน
              </Text>
              <Text style={[styles.HText, {paddingVertical: 20}]}>
                ตัวอย่างรูปถ่ายคู่ผู้สมัครพร้อมบัตรประชาชน
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                }}
                onPress={onAddImage}>
                {image == null && !imgCard ? (
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
                      <Text style={styles.label}>เปลี่ยนรูป</Text>
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
                      {imgCard ? (
                        <Image
                          source={{
                            uri: imgCard,
                          }}
                          style={{
                            width: width * 0.9,
                            height: normalize(162),
                            borderRadius: 20,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: image ? image.assets[0].uri : null,
                          }}
                          style={{
                            width: width * 0.9,
                            height: normalize(162),
                            borderRadius: 20,
                          }}
                        />
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <TextInput
                allowFontScaling={false}
                defaultValue={idNo}
                style={styles.input}
                placeholder="เลขบัตรประชาชน"
                maxLength={13}
                keyboardType={'number-pad'}
                onChangeText={value => {
                  setIdCard(value);
                }}
              />
              <Text style={[styles.label, {color: colors.gray}]}>
                ใส่เลข 13 หลักโดยไม่ต้องเว้นวรรค
              </Text>
            </View>
            <View>
              <MainButton
                label="บันทึก"
                color={
                  idcard.length === 13 && image != null
                    ? colors.orange
                    : colors.disable
                }
                disable={idcard.length === 13 && image != null ? false : true}
                onPress={() => {
                  if (idcard.length === 13 && image != null) {
                    setLoading(true);
                    Register.registerStep4(
                      telNo,
                      idcard,
                      Number(percentSuccess) + 20,
                    )
                      .then(() => {
                        ProfileDatasource.uploadDronerIDCard(image)
                          .then(() => {
                            setLoading(false);
                            navigation.navigate('MyProfileScreen');
                          })
                          .catch(err => console.log(err));
                      })
                      .catch(err => console.log(err));
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
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default IDCardScreen;
const styles = StyleSheet.create({
  inner: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(17),
  },
  label: {
    fontSize: normalize(12),
    fontFamily: font.medium,
  },
  text: {
    fontSize: normalize(18),
    fontFamily: font.medium,
    alignSelf: 'center',
  },
  HText: {
    fontSize: normalize(18),
    fontFamily: font.medium,
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
  camera: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.regular,
    fontSize: normalize(16),
  },
});
