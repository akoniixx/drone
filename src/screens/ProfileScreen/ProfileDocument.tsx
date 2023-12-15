import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@rneui/themed';
import {font, icons} from '../../assets';
import {stylesCentral} from '../../styles/StylesCentral';
import colors from '../../assets/colors/colors';
import {StatusObject} from '../../components/Drone/DroneBranding';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import Text from '../../components/Text';
import Spinner from 'react-native-loading-spinner-overlay';

const ProfileDocument: React.FC<any> = ({navigation, route}) => {
  const profilestate = route.params.profile;
  const [idCard, setIdCard] = useState({
    fileName: '',
  });
  const [dronerLicense, setDronerLicense] = useState();
  const [bookBank, setBookBank] = useState();
  const [image, setImage] = useState<any>(null);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string>('');
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setLoading(true);

      await ProfileDatasource.uploadDronerIDCard(result)
        // .then(res => {
        //   console.log(res);
        // })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
      setImage(result);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
    }, []),
  );

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    ProfileDatasource.getProfile(dronerId).then(res => {
      setProfile(res);
      res?.file?.filter(async (item: any) => {
        if (item.category === 'ID_CARD_IMAGE') {
          setIdCard(item);
          const droner_id = await AsyncStorage.getItem('droner_id');
          ProfileDatasource.getImgePath(droner_id!, item.path).then(res => {
            setImageURL(res.url);
          });
        } else if (item.category === 'DRONER_LICENSE') {
          setDronerLicense(item);
        } else if (item.category === 'BOOK_BANK') {
          setBookBank(item);
        }
      });
    });
  };

  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <View style={styles.appBarBack}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrowLeft} style={styles.listTileIcon} />
        </TouchableOpacity>
        <Text style={[styles.appBarHeader]}>ส่งเอกสารเพิ่มเติม </Text>
        <View style={styles.listTileIcon} />
      </View>
      <View style={styles.body}>
        <View style={styles.content}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.header}>สถานะบัญชีนักบินโดรน</Text>
            <View
              style={{
                marginTop: normalize(10),
                width: normalize(109),
                height: normalize(24),
                borderRadius: normalize(12),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: StatusObject(profilestate.status).colorBg,
              }}>
              <Text
                style={{
                  color: StatusObject(profilestate.status).fontColor,
                  fontFamily: font.regular,
                  fontSize: normalize(14),
                }}>
                {StatusObject(profilestate.status).status === 'ตรวจสอบแล้ว'
                  ? 'ยืนยันตัวตนแล้ว'
                  : StatusObject(profilestate.status).status}
              </Text>
            </View>
          </View>

          {profilestate.status !== 'ACTIVE' ? (
            <>
              <View style={{borderBottomWidth: 1, borderColor: '#F3F3F5'}} />
              <View style={{marginTop: normalize(16)}}>
                <Text
                  style={{fontFamily: font.medium, fontSize: normalize(16)}}>
                  อัปโหลดรูปถ่ายผู้สมัครคู่บัตรประชาชน
                </Text>

                <TouchableOpacity
                  style={{
                    marginVertical: 20,
                  }}
                  onPress={onAddImage}>
                  {image == null && idCard === undefined ? (
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
                      <Text>เพิ่มเอกสารด้วย ไฟล์รูป </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: normalize(76),
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFBF6',
                        borderColor: '#FF981E',
                        borderWidth: 1,
                        paddingHorizontal: normalize(10),
                      }}>
                      <View
                        style={{alignItems: 'center', flexDirection: 'row'}}>
                        <Image
                          source={{
                            uri:
                              image == null && idCard !== undefined
                                ? imageURL
                                : image.assets[0].uri,
                          }}
                          style={{
                            width: normalize(36),
                            height: normalize(36),
                          }}
                        />
                        <View style={{width: '50%', marginLeft: 10}}>
                          <Text ellipsizeMode="tail" numberOfLines={1}>
                            {image == null && idCard !== undefined
                              ? idCard.fileName
                              : image.assets[0].fileName}
                          </Text>
                        </View>
                      </View>
                      <Image
                        source={icons.closeBlack}
                        style={{width: normalize(16), height: normalize(16)}}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UploadDronerLicenseScreen', {
                dronerLicense: dronerLicense,
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: font.medium, fontSize: normalize(16)}}>
                อัปโหลดใบอนุญาตนักบิน{' '}
              </Text>
              <Image
                source={icons.arrowRight}
                style={{width: normalize(15.5), height: normalize(8.5)}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UploadBankingScreen', {
                bookBank: bookBank,
                profile: profile,
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: font.medium, fontSize: normalize(16)}}>
                อัปโหลดสมุดบัญชีธนาคาร
              </Text>

              <Image
                source={icons.arrowRight}
                style={{width: normalize(15.5), height: normalize(8.5)}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#E5E5E5'}}
      />
    </SafeAreaView>
  );
};

export default ProfileDocument;

const styles = StyleSheet.create({
  appBarBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  body: {
    flex: 9,
    paddingTop: normalize(10),
    backgroundColor: colors.disable,
  },
  content: {
    backgroundColor: colors.white,
    padding: normalize(17),
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
    borderRadius: 10,
  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
    color: colors.fontBlack,
  },
  header: {
    fontFamily: font.bold,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(5),
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  idcardheader: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    paddingTop: normalize(20),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  addImage: {
    width: '100%',
    height: normalize(162),
    borderColor: '#FF981E',
    borderStyle: 'dotted',
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
});
