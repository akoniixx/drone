import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image as img} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import {Avatar} from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {registerReducer} from '../../hooks/registerfield';
import {Register} from '../../datasource/AuthDatasource';
import Geolocation from 'react-native-geolocation-service';
import * as ImagePicker from 'react-native-image-picker';
import Lottie from 'lottie-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalendarCustom from '../../components/Calendar/Calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {build12Year, CalendarMode} from '../../hooks/calendar';
import Text from '../../components/Text';
import AnimatedInput from '../../components/Input/AnimatedInput';

const SecondFormScreen: React.FC<any> = ({navigation, route}) => {
  const initialFormRegisterState = {
    name: '',
    surname: '',
    birthDate: '',
    tel: route.params.tele,
    no: '',
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  };

  const windowWidth = Dimensions.get('window').width;
  const tele = route.params.tele;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [openSubDistrict, setOpenSubDistrict] = useState(false);
  const [valueSubDistrict, setSubValueDistrict] = useState(null);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [province, setProvince] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [subdistrict, setSubdistrict] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bottompadding, setBottomPadding] = useState(0);
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, [image]);

  useEffect(() => {
    QueryLocation.QueryProvince().then(res => {
      const Province = res.map((item: any) => {
        return {label: item.provinceName, value: item.provinceId};
      });
      setItems(Province);
    });
  }, []);

  useEffect(() => {
    if (province != null) {
      QueryLocation.QueryDistrict(province.value).then(res => {
        const District = res.map((item: any) => {
          return {label: item.districtName, value: item.districtId};
        });
        setItemDistrict(District);
      });
    }
  }, [province]);

  useEffect(() => {
    if (province != null && district != null) {
      QueryLocation.QuerySubDistrict(district.value, district.label).then(
        res => {
          const SubDistrict = res.map((item: any) => {
            return {
              label: item.subdistrictName,
              value: item.subdistrictId,
              postcode: item.postcode,
            };
          });
          setItemSubDistrict(SubDistrict);
        },
      );
    }
  }, [province, district]);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );
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
            <ProgressBar index={2} />
          </View>
          <Text style={styles.label}>ขั้นตอนที่ 2 จาก 4</Text>
          <Text style={styles.h1}>กรอกข้อมูลทั่วไป</Text>
          <ScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(40),
              }}>
              <TouchableOpacity onPress={onAddImage}>
                <View
                  style={{
                    width: normalize(116),
                    height: normalize(116),
                    position: 'relative',
                  }}>
                  <Avatar
                    size={116}
                    rounded
                    source={!image ? icons.account : {uri: image.assets[0].uri}}
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
              label="ชื่อ"
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'name',
                  payload: value,
                });
              }}
              value={formState.name}
            />

            <TextInput
              allowFontScaling={false}
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'surname',
                  payload: value,
                });
              }}
              value={formState.surname}
              style={styles.input}
              editable={true}
              placeholder={'นามสกุล'}
              placeholderTextColor={colors.disable}
            />
            <TouchableOpacity onPress={() => setOpenCalendar(true)}>
              <View
                style={[
                  styles.input,
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                  },
                ]}>
                <TextInput
                  allowFontScaling={false}
                  value={
                    birthday != ''
                      ? `${birthday.split('-')[2]}/${birthday.split('-')[1]}/${
                          parseInt(birthday.split('-')[0]) + 543
                        }`
                      : birthday
                  }
                  editable={false}
                  placeholder={'วัน/เดือน/ปี เกิด'}
                  style={{width: windowWidth * 0.78, color: colors.fontBlack}}
                />
                <Image
                  source={icons.jobCard}
                  style={{
                    width: normalize(25),
                    height: normalize(30),
                  }}
                />
              </View>
            </TouchableOpacity>
            <TextInput
              allowFontScaling={false}
              value={tele}
              style={[styles.input, {backgroundColor: colors.disable}]}
              editable={false}
              placeholder={'เบอร์โทรศัพท์'}
              placeholderTextColor={colors.disable}
            />
            <View style={{marginTop: normalize(40)}}>
              <Text style={styles.h1}>ที่อยู่</Text>
            </View>
            <TextInput
              allowFontScaling={false}
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'no',
                  payload: value,
                });
              }}
              value={formState.no}
              style={styles.input}
              editable={true}
              placeholder={'บ้านเลขที่'}
              placeholderTextColor={colors.disable}
            />
            <TextInput
              allowFontScaling={false}
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'address',
                  payload: value,
                });
              }}
              value={formState.address}
              style={styles.input}
              editable={true}
              placeholder={'รายละเอียดที่อยู่ (หมู่, ถนน)'}
              placeholderTextColor={colors.disable}
            />
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
                borderColor: colors.disable,
              }}
              placeholder="จังหวัด"
              placeholderStyle={{
                color: colors.disable,
              }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              onSelectItem={value => {
                setProvince(value);
                dispatch({
                  type: 'Handle Input',
                  field: 'province',
                  payload: value,
                });
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
              disabled={!province ? true : false}
              style={{
                borderColor: colors.disable,
                marginVertical: 10,
                backgroundColor: !province ? colors.disable : colors.white,
              }}
              placeholder="อำเภอ"
              placeholderStyle={{
                color: !province ? colors.gray : colors.disable,
              }}
              onOpen={() => {
                setBottomPadding(60);
              }}
              onClose={() => {
                setBottomPadding(0);
              }}
              open={openDistrict}
              value={valueDistrict}
              items={itemsDistrict}
              setOpen={setOpenDistrict}
              onSelectItem={value => {
                setDistrict(value);
                dispatch({
                  type: 'Handle Input',
                  field: 'district',
                  payload: value,
                });
              }}
              setValue={setValueDistrict}
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
              zIndex={1000}
              zIndexInverse={3000}
              disabled={!district ? true : false}
              style={{
                borderColor: colors.disable,
                marginVertical: 10,
                backgroundColor: !district ? colors.disable : colors.white,
              }}
              placeholder="ตำบล"
              placeholderStyle={{
                color: !district ? colors.gray : colors.disable,
              }}
              onOpen={() => {
                setBottomPadding(120);
              }}
              onClose={() => {
                setBottomPadding(0);
              }}
              open={openSubDistrict}
              value={valueSubDistrict}
              items={itemsSubDistrict}
              setOpen={setOpenSubDistrict}
              onSelectItem={(value: any) => {
                setSubdistrict(value);
                dispatch({
                  type: 'Handle Input',
                  field: 'subdistrict',
                  payload: value,
                });
                dispatch({
                  type: 'Handle Input',
                  field: 'postal',
                  payload: value.postcode,
                });
              }}
              setValue={setSubValueDistrict}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <TextInput
              allowFontScaling={false}
              value={formState.postal}
              style={[
                styles.input,
                {
                  backgroundColor: colors.disable,
                  marginBottom: normalize(bottompadding),
                },
              ]}
              editable={false}
              placeholder={'รหัสไปรษณีย์'}
            />
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white, zIndex: 0}}>
          <MainButton
            label="ถัดไป"
            disable={
              !formState.name ||
              !formState.surname ||
              !formState.tel ||
              !formState.birthDate ||
              !formState.no ||
              !formState.address ||
              !formState.province.value ||
              !formState.district.value ||
              !formState.subdistrict.value ||
              !formState.postal
                ? true
                : false
            }
            color={colors.orange}
            onPress={() => {
              setLoading(true);
              Register.registerStep2(
                formState.name,
                formState.surname,
                formState.birthDate,
                formState.tel,
                formState.no,
                formState.address,
                formState.province.value,
                formState.district.value,
                formState.subdistrict.value,
                formState.postal,
              )
                .then(async res => {
                  if (!image) {
                    if (Platform.OS === 'ios') {
                      await Geolocation.requestAuthorization('always');
                    } else if (Platform.OS === 'android') {
                      await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                      );
                    }
                    Geolocation.getCurrentPosition(
                      position => {
                        setLoading(false);
                        navigation.navigate('ThirdFormScreen', {
                          tele: formState.tel,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        });
                      },
                      error => {
                        console.log(error.code, error.message);
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                      },
                    );
                  } else {
                    Register.uploadProfileImage(image)
                      .then(async res => {
                        if (Platform.OS === 'ios') {
                          await Geolocation.requestAuthorization('always');
                        } else if (Platform.OS === 'android') {
                          await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                          );
                        }
                        Geolocation.getCurrentPosition(
                          position => {
                            setLoading(false);
                            navigation.navigate('ThirdFormScreen', {
                              tele: formState.tel,
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                            });
                          },
                          error => {
                            console.log(error.code, error.message);
                          },
                          {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000,
                          },
                        );
                      })
                      .catch(err => console.log(err));
                  }
                })
                .catch(err => console.log(err));
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
        <Modal transparent={true} visible={openCalendar}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderRadius: normalize(8),
                backgroundColor: colors.white,
                width: windowWidth * 0.9,
                padding: normalize(20),
              }}>
              <CalendarCustom
                disableFuture
                value={birthday}
                onHandleChange={day => {
                  setBirthday(day.dateString);
                  setOpenCalendar(false);
                  dispatch({
                    type: 'Handle Input',
                    field: 'birthDate',
                    payload: new Date(day.timestamp),
                  });
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
export default SecondFormScreen;

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
