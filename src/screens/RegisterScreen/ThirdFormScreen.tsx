import {
  View,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import fonts from '../../assets/fonts';
import {plantList} from '../../definitions/plants';
import {PlantSelect} from '../../components/PlantSelect';
import ActionSheet from 'react-native-actions-sheet';
import {icons} from '../../assets';
import DropDownPicker from 'react-native-dropdown-picker';
import {Register} from '../../datasource/AuthDatasource';
import * as ImagePicker from 'react-native-image-picker';
import {QueryLocation} from '../../datasource/LocationDatasource';
import Lottie from 'lottie-react-native';
import DroneBrandingItem from '../../components/Drone/DroneBranding';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';

const ThirdFormScreen: React.FC<any> = ({route, navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [position, setPosition] = useState({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const telNo = route.params;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<any>([]);
  const [opentype, setOpentype] = useState(false);
  const [valuetype, setValuetype] = useState(null);
  const [brand, setBrand] = useState<any>(null);
  const [brandtype, setBrandType] = useState<any>(null);
  const [itemstype, setItemstype] = useState<any>([]);
  const [address, setAddress] = useState('');
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  const [result, setResult] = useState<string[]>([]);
  const [addPlant, setAddPlant] = useState<string>('');
  const [dronedataUI, setDronedataUI] = useState<any>([]);
  const [dronedata, setDronedata] = useState<any>([]);
  const [droneno, setdroneno] = useState<any>(null);
  const [provinceId, setProvinceId] = useState<any>(null);
  const [districtId, setDistrictId] = useState<any>(null);
  const [subdistrictId, setSubdistrictId] = useState<any>(null);
  const [lat, setlat] = useState<any>(null);
  const [long, setlong] = useState<any>(null);
  const [image1, setImage1] = useState<any>(null);
  const [image2, setImage2] = useState<any>(null);
  const [popupPage, setpopupPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [arrayFile1, setArrayFile1] = useState<any>([]);
  const [arrayFile2, setArrayFile2] = useState<any>([]);
  const actionSheet = useRef<any>();

  useEffect(() => {
    const getNameFormLat = () => {
      let myApiKey = 'AIzaSyDg4BI3Opn-Bo2Pnr40Z7PKlC6MOv8T598';
      let myLat = position.latitude;
      let myLon = position.longitude;
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          myLat +
          ',' +
          myLon +
          '&key=' +
          myApiKey,
      )
        .then(response => response.json())
        .then(responseJson => {
          setlat(responseJson.results[0].geometry.location.lat);
          setlong(responseJson.results[0].geometry.location.lng);
          setAddress(
            responseJson.results[0].address_components[0].long_name +
              ' ' +
              responseJson.results[0].address_components[2].long_name +
              ' ' +
              responseJson.results[0].address_components[3].long_name +
              ' ' +
              responseJson.results[0].address_components[4].long_name,
          );
          QueryLocation.QueryProvince()
            .then(item => {
              item.map((Province: any) => {
                if (
                  Province.provinceName ==
                  `จังหวัด${responseJson.results[0].address_components[3].long_name}`
                ) {
                  setProvinceId(Province.provinceId);
                  QueryLocation.QueryDistrict(Province.provinceId)
                    .then((itemDistrict: any) => {
                      itemDistrict.map((District: any) => {
                        if (
                          District.districtName ===
                          `${
                            responseJson.results[0].address_components[2].long_name.split(
                              ' ',
                            )[0]
                          }${
                            responseJson.results[0].address_components[2].long_name.split(
                              ' ',
                            )[1]
                          }`
                        ) {
                          setDistrictId(District.districtId);
                          QueryLocation.QuerySubDistrict(
                            District.districtId,
                            District.districtName,
                          )
                            .then(itemSubDistrict => {
                              itemSubDistrict.map((SubDistrict: any) => {
                                if (
                                  SubDistrict.districtName ===
                                  `${
                                    responseJson.results[0].address_components[2].long_name.split(
                                      ' ',
                                    )[0]
                                  }${
                                    responseJson.results[0].address_components[2].long_name.split(
                                      ' ',
                                    )[1]
                                  }`
                                ) {
                                  setSubdistrictId(SubDistrict.subdistrictId);
                                }
                              });
                            })
                            .catch(err => console.log(err));
                        }
                      });
                    })
                    .catch(err => console.log(err));
                }
              });
            })
            .catch(err => console.log(err));
        });
    };
    getNameFormLat();
  }, [position]);

  useEffect(() => {
    const hasLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        const hasPermission = await hasPermissionIOS();
        return hasPermission;
      }

      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(
          'Location permission denied by user.',
          ToastAndroid.LONG,
        );
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
          'Location permission revoked by user.',
          ToastAndroid.LONG,
        );
      }

      return false;
    };
    const getLocation = async () => {
      const hasPermission = await hasLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          pos => {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    };
    getLocation();
    Register.getDroneBrand(1, 14)
      .then(result => {
        const data = result.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            image: item.logoImagePath,
            icon: () =>
              item.logoImagePath != null ? (
                <Image
                  source={{uri: item.logoImagePath}}
                  style={{width: 30, height: 30, borderRadius: 15}}
                />
              ) : (
                <></>
              ),
          };
        });
        setItems(data);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    if (brand != null) {
      Register.getDroneBrandType(brand.value)
        .then(result => {
          const data = result.drone.map((item: any) => {
            return {label: item.series, value: item.id};
          });
          setItemstype(data);
        })
        .catch(err => console.log(err));
    }
  }, [brand]);
  const uploadFile1 = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage1(result);
    }
  };
  const uploadFile2 = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage2(result);
    }
  };

  const handleSelect = (
    value: any,
    index: number,
    label: string,
    status: boolean,
  ) => {
    const data = [...value];
    data[index].active = !status;
    const resultarray = result.findIndex(e => e === label);
    if (resultarray === -1) {
      result.push(label);
    } else {
      result.splice(index, 1);
    }
    setResult(result);
    setPlantListSelect(data);
  };

  const addSelect = (value: string) => {
    const data = [...plantListSelect];
    const resultarray = data.findIndex(e => e.value === value);
    if (resultarray === -1) {
      const newplant = {value: value, active: true};
      data.push(newplant);
      setPlantListSelect(data);
    }
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow  to determine your location.',
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const addDrone = () => {
    mixpanel.track('Add drone');
    const drones = [...dronedata];
    const dronesUI = [...dronedataUI];
    const newDrone = {
      droneId: brandtype.value,
      serialNo: droneno,
      status: 'PENDING',
    };
    const newDroneUI = {
      img: brand.image,
      droneBrand: brandtype.label,
      serialBrand: droneno,
    };
    drones.push(newDrone);
    dronesUI.push(newDroneUI);
    setValue(null);
    setValuetype(null);
    setDronedata(drones);
    setDronedataUI(dronesUI);
    setBrand(null);
    setBrandType(null);
    setdroneno(null);
    actionSheet.current.hide();
  };

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
              <ProgressBar index={3} />
            </View>
            <Text style={styles.label}>ขั้นตอนที่ 3 จาก 4</Text>
            <Text style={styles.h1}>กรอกข้อมูลการบินโดรน</Text>
            <ScrollView>
              <Text style={[styles.h1, {marginTop: normalize(39)}]}>
                พื้นที่ให้บริการหลัก
              </Text>
              <View
                style={{
                  borderColor: colors.gray,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={image.map}
                  style={{
                    width: normalize(24),
                    height: normalize(22),
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(16),
                    color: colors.gray,
                  }}>
                  {address}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <MapView.Animated
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={position}
                  showsUserLocation={true}
                  onRegionChangeComplete={region => setPosition(region)}
                  showsMyLocationButton={true}
                />
                <View style={styles.markerFixed}>
                  <Image style={styles.marker} source={image.marker} />
                </View>
              </View>
              <View
                style={{
                  marginTop: normalize(39),
                  marginBottom: normalize(20),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[styles.h1]}>พืชที่เคยฉีดพ่น</Text>
                <Text style={[styles.h2, {color: colors.gray}]}>
                  (กรุณาเลือกอย่างน้อย 1 อย่าง)
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {plantListSelect.map((v, i) => (
                  <PlantSelect
                    key={i}
                    label={v.value}
                    active={v.active}
                    onPress={() =>
                      handleSelect(plantListSelect, i, v.value, v.active)
                    }
                  />
                ))}
              </View>
              <View style={styles.input}>
                <TextInput
                  allowFontScaling={false}
                  placeholder="พืชอื่นๆ"
                  placeholderTextColor={colors.disable}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: addPlant.length != 0 ? '80%' : '100%',
                    color: colors.fontBlack,
                  }}
                  onChangeText={value => setAddPlant(value)}
                />
                {addPlant.length != 0 ? (
                  <TouchableOpacity
                    style={{
                      marginBottom: normalize(10),
                      width: normalize(60),
                      height: normalize(30),
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#2BB0ED',
                    }}
                    onPress={() => addSelect(addPlant)}>
                    <Text style={[styles.h2, {color: colors.white}]}>
                      เพิ่ม
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
              <View>
                <View
                  style={{
                    marginTop: normalize(39),
                    marginBottom: normalize(20),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.h2, {paddingRight: 3}]}>
                    โดรนฉีดพ่นของคุณ
                  </Text>
                  <Text style={[styles.h2, {color: colors.gray}]}>
                    (เพิ่มได้ภายหลัง)
                  </Text>
                </View>
                {dronedataUI.length === 0 && dronedata.length === 0 ? (
                  <></>
                ) : (
                  <View
                    style={{
                      marginTop: normalize(20),
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    {dronedataUI.map((item: any, index: number) => (
                      <DroneBrandingItem
                        key={index}
                        dronebrand={item.droneBrand}
                        serialbrand={item.serialBrand}
                        status={'PENDING'}
                        image={item.img}
                      />
                    ))}
                  </View>
                )}
                <View style={{backgroundColor: colors.white}}>
                  <MainButton
                    label="+ เพิ่มโดรน"
                    fontColor={colors.orange}
                    color={'#FFEAD1'}
                    onPress={() => {
                      actionSheet.current.show();
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={{backgroundColor: colors.white}}>
            <MainButton
              disable={plantListSelect.every(item => item.active === false)}
              label="ถัดไป"
              color={colors.orange}
              onPress={() => {
                setLoading(true);
                let plant: string[] = [];
                plantListSelect.map(item => {
                  if (item.active) {
                    plant.push(item.value);
                  }
                });
                Register.registerStep3(
                  telNo.tele,
                  provinceId,
                  districtId,
                  subdistrictId,
                  address,
                  plant,
                  lat,
                  long,
                )
                  .then(() => {
                    Register.uploadDronerdrone(dronedata)
                      .then(() => {
                        setLoading(false);
                        navigation.navigate('FourthFormScreen', {
                          tele: telNo.tele,
                        });
                      })
                      .catch(err => console.log(err));
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
            />
          </View>
        </View>
      </View>
      <ActionSheet ref={actionSheet}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(30),
            paddingHorizontal: normalize(20),
            width: windowWidth,
            height: windowHeight * 0.85,
            borderRadius: normalize(20),
          }}>
          <View
            style={[
              stylesCentral.container,
              {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
            ]}>
            {popupPage == 1 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                  <View
                    style={{
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        actionSheet.current.hide();
                      }}>
                      <Image
                        source={icons.close}
                        style={{
                          width: normalize(14),
                          height: normalize(14),
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.hSheet}>เพิ่มโดรน</Text>
                    <View
                      style={{
                        width: normalize(14),
                        height: normalize(14),
                      }}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 16,
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.h2}>ยี่ห้อโดรนฉีดพ่น</Text>
                      <Text
                        style={[
                          styles.h2,
                          {color: colors.gray, paddingLeft: 4},
                        ]}>
                        (กรุณาเพิ่มอย่างน้อย 1 รุ่น)
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingTop: 12,
                      }}>
                      <DropDownPicker
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        style={{
                          marginVertical: 10,
                          backgroundColor: colors.white,
                          borderColor: colors.gray,
                        }}
                        placeholder="เลือกยี่ห้อโดรน"
                        placeholderStyle={{
                          color: colors.gray,
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        onSelectItem={value => {
                          setBrand(value);
                        }}
                        setValue={setValue}
                        dropDownDirection="BOTTOM"
                        dropDownContainerStyle={{
                          borderColor: colors.disable,
                        }}
                      />
                      <DropDownPicker
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                        zIndex={2000}
                        zIndexInverse={2000}
                        style={{
                          marginVertical: 10,
                          backgroundColor: colors.white,
                          borderColor: colors.gray,
                        }}
                        placeholder="รุ่น"
                        placeholderStyle={{
                          color: colors.gray,
                        }}
                        open={opentype}
                        value={valuetype}
                        items={itemstype}
                        setOpen={setOpentype}
                        onSelectItem={value => {
                          setBrandType(value);
                        }}
                        setValue={setValuetype}
                        dropDownDirection="BOTTOM"
                        dropDownContainerStyle={{
                          borderColor: colors.disable,
                        }}
                      />
                      <TextInput
                        allowFontScaling={false}
                        placeholderTextColor={colors.gray}
                        onChangeText={value => {
                          setdroneno(value);
                        }}
                        value={droneno}
                        style={styles.input}
                        editable={true}
                        placeholder={'เลขตัวถังโดรน'}
                      />
                    </View>
                  </View>
                </ScrollView>
                <MainButton
                  disable={!brand || !brandtype ? true : false}
                  label="ถัดไป"
                  color={colors.orange}
                  onPress={addDrone}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <View>
                    <View
                      style={{
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          // sheetRef.current.snapTo(1);
                        }}>
                        <Image
                          source={icons.close}
                          style={{
                            width: normalize(14),
                            height: normalize(14),
                          }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.hSheet}>เพิ่มเอกสาร</Text>
                      <View />
                    </View>
                    <Text style={[styles.h2, {paddingTop: 12}]}>
                      อัปโหลดใบอนุญาตนักบิน
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
                          <Image
                            source={icons.register}
                            style={{
                              width: normalize(12),
                              height: normalize(15),
                            }}
                          />
                          <Text style={[styles.label, {paddingLeft: 4}]}>
                            เพิ่มเอกสารด้วย ไฟล์รูป หรือ PDF
                          </Text>
                        </View>
                        <View>
                          {image1 != null ? (
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 5,
                                width: windowWidth * 0.5,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.label,
                                  {paddingLeft: 4, color: colors.orange},
                                ]}>
                                {image1.assets[0].fileName}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  setImage1(null);
                                }}>
                                <View
                                  style={{
                                    width: normalize(16),
                                    height: normalize(16),
                                    marginLeft: normalize(8),
                                    borderRadius: normalize(8),
                                    backgroundColor: colors.fontBlack,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: colors.white,
                                    }}>
                                    x
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                      <MainButton
                        fontSize={normalize(14)}
                        label={!image1 ? 'เพิ่มเอกสาร' : 'เปลี่ยน'}
                        color={!image1 ? colors.orange : colors.gray}
                        onPress={uploadFile1}
                      />
                    </View>
                    <View
                      style={{
                        borderBottomColor: colors.gray,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 10,
                      }}
                    />
                    <Text style={[styles.h2, {paddingTop: 12}]}>
                      อัปโหลดใบอนุญาตโดรนจาก กสทช.
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
                          <Image
                            source={icons.register}
                            style={{
                              width: normalize(12),
                              height: normalize(15),
                            }}
                          />
                          <Text style={[styles.label, {paddingLeft: 4}]}>
                            เพิ่มเอกสารด้วย ไฟล์รูป หรือ PDF
                          </Text>
                        </View>
                        <View>
                          {image2 != null ? (
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 5,
                                width: windowWidth * 0.5,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.label,
                                  {paddingLeft: 4, color: colors.orange},
                                ]}>
                                {image2.assets[0].fileName}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  setImage2(null);
                                }}>
                                <View
                                  style={{
                                    width: normalize(16),
                                    height: normalize(16),
                                    marginLeft: normalize(8),
                                    borderRadius: normalize(8),
                                    backgroundColor: colors.fontBlack,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: colors.white,
                                    }}>
                                    x
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                      <MainButton
                        fontSize={normalize(14)}
                        label={!image2 ? 'เพิ่มเอกสาร' : 'เปลี่ยน'}
                        color={!image2 ? colors.orange : colors.gray}
                        onPress={uploadFile2}
                      />
                    </View>
                  </View>
                </View>
                <View>
                  <MainButton
                    disable={!image2 ? true : false}
                    label="ถัดไป"
                    color={colors.orange}
                    onPress={() => {
                      if (image1 == null && image2 != null) {
                        arrayFile2.push(image2);
                        setArrayFile2(arrayFile2);
                        setImage2(null);
                        setBrand(null);
                        setBrandType(null);
                        setpopupPage(1);
                        setValue(null);
                        setValuetype(null);
                        setdroneno(null);
                        actionSheet.current.hide();
                      } else if (image1 != null && image2 != null) {
                        arrayFile1.push(image1);
                        setArrayFile1(arrayFile1);
                        arrayFile2.push(image2);
                        setImage1(null);
                        setImage2(null);
                        setArrayFile2(arrayFile2);
                        setBrand(null);
                        setBrandType(null);
                        setpopupPage(1);
                        setdroneno(null);
                        setValue(null);
                        setValuetype(null);
                        actionSheet.current.hide();
                      }
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </ActionSheet>
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
              source={image.loading}
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
  );
};
export default ThirdFormScreen;

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
  },
  varidate: {
    fontFamily: font.medium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.bold,
    fontSize: normalize(16),
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

  map: {
    width: normalize(344),
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
  input: {
    display: 'flex',
    paddingHorizontal: normalize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});
