import {
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '../../function/Normalize';
import {colors, font, icons, image} from '../../assets';
import {ProgressBarV2} from '../../components/ProgressBarV2';
import React, {useEffect, useState} from 'react';
import fonts from '../../assets/fonts';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {Register} from '../../datasource/AuthDatasource';
import Text from '../../components/Text';
import AsyncButton from '../../components/Button/AsyncButton';
import {Linking} from 'react-native';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import {MainButton} from '../../components/Button/MainButton';
import {useNetwork} from '../../contexts/NetworkContext';
import {mixpanel} from '../../../mixpanel';
interface AreaServiceEntity {
  area: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  locationName: string;
}

const SecondFormScreenV2: React.FC<any> = ({navigation, route}) => {
  const [searchActive, setSearchActive] = useState<string>('');
  const [allowLocal, setAllowLocal] = useState(false);
  const [permission, setPermission] = useState<
    | 'denied'
    | 'granted'
    | 'disabled'
    | 'restricted'
    | 'never_ask_again'
    | undefined
  >();
  const {appState} = useNetwork();

  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<AreaServiceEntity[]>([]);
  const [dataStore, setDataStore] = useState<AreaServiceEntity[]>([]);
  const [dataRender, setDataRender] = useState<AreaServiceEntity[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchResult, setSearchResult] = useState<string>('');
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const [positionForm, setPositionForm] = useState<AreaServiceEntity>({
    area: '',
    latitude: 0,
    longitude: 0,
    provinceId: 0,
    districtId: 0,
    subdistrictId: 0,
    locationName: '',
  });
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await Geolocation.requestAuthorization('always');
      return result;
    } else if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return result;
    }
  };

  useEffect(() => {
    if (appState === 'active') {
      requestLocationPermission().then(res => setPermission(res));
    }
  }, [appState]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        setAllowLocal(true);
      }
    };
    if (permission) {
      getCurrentLocation();
    }
  }, [permission]);

  // useEffect(() => {
  //   // getNameFormLat();
  // }, [position]);

  useEffect(() => {
    QueryLocation.getSubdistrictArea(0, '').then(res => {
      let all = res.map((item: any) => {
        return {
          area: `${item.subdistrictName}/${item.districtName}/${item.provinceName}`,
          latitude: item.lat,
          longitude: item.long,
          provinceId: item.provinceId,
          districtId: item.districtId,
          subdistrictId: item.subdistrictId,
        };
      });
      setData(all);
    });
  }, []);

  const onChangeText = (text: string) => {
    setSearchActive(text);
  };

  useEffect(() => {
    setPage(0);
    let filter = data.filter(str => str.area.includes(searchActive));
    let arr = [];
    for (let i = 0; i < 20; i++) {
      if (filter[i]) {
        arr.push(filter[i]);
      }
    }
    setDataStore(filter);
    setDataRender(arr);
  }, [data, searchActive]);

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.first}>
        <View style={styles.inner}>
          <View style={styles.container}>
            <View style={{marginBottom: normalize(10)}}>
              <ProgressBarV2 index={2} />
            </View>
            <Text style={styles.label}>ขั้นตอนที่ 2 จาก 2</Text>
            <Text style={styles.h1}>กรอกข้อมูลการบินโดรน</Text>
            {edit ? (
              <View
                style={{
                  flex: 1,
                  // paddingTop: normalize(10),
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(16),
                      color: colors.fontBlack,
                    }}>
                    ค้นหาพื้นที่ให้บริการของคุณด้วยชื่อ ตำบล /อำเภอ /จังหวัด
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(16),
                      color: colors.darkOrange,
                    }}>
                    โดยไม่ต้องพิมพ์คำนำหน้าด้วยคำว่า ต., ตำบล, อ., อำเภอ, จ.,
                    จังหวัด
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    clearButtonMode={'always'}
                    style={[
                      styles.inputvalue,
                      {
                        marginTop: normalize(20),
                        borderWidth: normalize(1),
                        paddingVertical: normalize(15),
                        paddingHorizontal: normalize(10),
                        borderColor: colors.gray,
                        borderRadius: normalize(12),
                      },
                    ]}
                    value={searchActive}
                    onChangeText={val => onChangeText(val)}
                    placeholder="ระบุชื่อตำบล หรือ ชื่ออำเภอ หรือ ชื่อจังหวัด"
                    placeholderTextColor={colors.gray}
                  />
                </View>
                {searchActive.length != 0 ? (
                  <View
                    style={{
                      height: '70%',
                    }}>
                    {dataRender.length != 0 ? (
                      <FlatList
                        onScrollEndDrag={() => {
                          if (dataStore.length > dataRender.length) {
                            setPage(page + 1);
                          }
                        }}
                        data={dataRender}
                        renderItem={({item}) => (
                          <Pressable
                            onPress={() => {
                              setEdit(false);
                              setPage(0);
                              setSearchResult(item.area);
                              setSearchActive('');
                              setPosition({
                                ...position,
                                latitude: parseFloat(item.latitude.toString()),
                                longitude: parseFloat(
                                  item.longitude.toString(),
                                ),
                              });
                              setPositionForm({
                                ...positionForm,
                                area: item.area,
                                latitude: parseFloat(item.latitude.toString()),
                                longitude: parseFloat(
                                  item.longitude.toString(),
                                ),
                                provinceId: item.provinceId,
                                districtId: item.districtId,
                                subdistrictId: item.subdistrictId,
                              });
                            }}>
                            <View
                              style={{
                                padding: normalize(15),
                                borderBottomColor: colors.disable,
                                borderBottomWidth: normalize(0.5),
                              }}>
                              <Text
                                style={{
                                  fontFamily: fonts.medium,
                                  fontSize: normalize(16),
                                  color: colors.fontBlack,
                                }}>
                                {item.area}
                              </Text>
                            </View>
                          </Pressable>
                        )}
                        keyExtractor={item => item.area}
                      />
                    ) : (
                      <View
                        style={{
                          flex: 7,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={image.emptyareaservice}
                          style={{
                            width: normalize(137),
                            height: normalize(119),
                            marginBottom: normalize(20),
                          }}
                        />
                        <Text style={styles.inputvalue}>
                          ไม่พบพื้นที่ดังกล่าว
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      height: '60%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={image.emptyareaservice}
                      style={{
                        width: normalize(137),
                        height: normalize(119),
                        marginBottom: normalize(20),
                      }}
                    />
                    <Text style={styles.inputvalue}>
                      กรุณาค้นหาพื้นที่ให้บริการหลัก
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={{}}>
                <View
                  style={{
                    marginTop: normalize(20),
                    // padding: normalize(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.servicearea}
                      style={{
                        width: normalize(24),
                        height: normalize(24),
                      }}
                    />
                    <Text
                      style={{
                        paddingLeft: normalize(10),
                        fontFamily: font.medium,
                        fontSize: normalize(16),
                        color: colors.fontBlack,
                      }}>
                      พื้นที่ให้บริการหลัก
                    </Text>
                  </View>
                  <Pressable onPress={() => setEdit(true)}>
                    <View
                      style={[styles.input, {marginVertical: normalize(20)}]}>
                      <Text style={styles.label}>ตำบล/ อำเภอ/ จังหวัด</Text>
                      <Text style={styles.inputvalue}>{searchResult}</Text>
                    </View>
                  </Pressable>
                  <Text style={styles.inputvalue}>
                    ระยะทางพื้นที่ให้บริการหลักระหว่าง 50-100 กม.
                  </Text>
                  <View style={{position: 'relative'}}>
                    <MapView.Animated
                      minZoomLevel={14}
                      mapType={'satellite'}
                      style={styles.map}
                      provider={PROVIDER_GOOGLE}
                      region={position}
                      showsUserLocation={true}
                      onRegionChangeComplete={region => {
                        setPosition(region);
                        setPositionForm({
                          ...positionForm,
                          latitude: parseFloat(region.latitude.toString()),
                          longitude: parseFloat(region.longitude.toString()),
                        });
                      }}
                    />
                    <View style={styles.markerFixed}>
                      <Image style={styles.marker} source={image.marker} />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
          {edit ? (
            <></>
          ) : (
            <View
              style={{
                marginBottom: 18,
              }}>
              <AsyncButton
                disabled={positionForm.provinceId === 0}
                title="ถัดไป"
                onPress={() => {
                  Register.registerStep2V2(
                    positionForm.latitude.toString(),
                    positionForm.longitude.toString(),
                    positionForm.provinceId,
                    positionForm.districtId,
                    positionForm.subdistrictId,
                  )
                    .then(() => {
                      mixpanel.track('RegisterScreenStepTwo_ButtonNext_Press', {
                        province: positionForm.provinceId,
                        district: positionForm.districtId,
                        subdistrict: positionForm.subdistrictId,
                        lat: positionForm.latitude,
                        long: positionForm.longitude,
                        to: 'SuccessScreen',
                      });
                      navigation.navigate('SuccessScreen', {
                        tele: route.params.telNumber,
                      });
                    })
                    .catch(err => console.log(err));
                }}
              />
            </View>
          )}
        </View>
      </View>
      <Modal transparent={true} visible={allowLocal}>
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
              width: responsiveWidth(344),
              paddingHorizontal: normalize(20),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(8),
              paddingVertical: normalize(20),
            }}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              กรุณาเปิดการตั้งค่า
            </Text>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              การเข้าถึงตำแหน่งหรือโลเคชั่น
            </Text>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              ในโทรศัพท์
            </Text>
            <Text
              style={{
                fontFamily: font.regular,
                fontSize: normalize(14),
                paddingTop: normalize(10),
              }}>
              เพื่อเปิดการค้นหาเกษตรกรที่อยู่ใกล้
            </Text>
            <Text
              style={{
                fontFamily: font.regular,
                fontSize: normalize(14),
              }}>
              พื้นที่ให้บริการของคุณ
            </Text>
            <MainButton
              style={{
                width: responsiveWidth(312),
                height: responsiveHeigth(53),
                marginTop: normalize(20),
              }}
              label="ตกลง"
              color={colors.orange}
              onPress={() => {
                Linking.openSettings();
                setAllowLocal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
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
    fontSize: normalize(12),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
  map: {
    width: '100%',
    height: normalize(190),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: normalize(31),
    width: normalize(26),
  },
  inputvalue: {
    fontFamily: font.regular,
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
});

export default SecondFormScreenV2;
