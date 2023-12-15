import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image as img} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {ScrollView} from 'react-native-gesture-handler';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {registerReducer} from '../../hooks/registerfield';
import {Authentication} from '../../datasource/AuthDatasource';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Lottie from 'lottie-react-native';
import CalendarCustom from '../../components/Calendar/Calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AnimatedInput from '../../components/Input/AnimatedInput';
import Dropdown from '../../components/Dropdown/Dropdown';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text';
import moment from 'moment';
import AsyncButton from '../../components/Button/AsyncButton';
import InfoCircle from '../../components/InfoCircle';
import {mixValidator} from '../../function/inputValidate';
import crashlytics from '@react-native-firebase/crashlytics';
import {mixpanel} from '../../../mixpanel';

const EditProfile: React.FC<any> = ({navigation}) => {
  const initialFormRegisterState = {
    name: '',
    surname: '',
    birthDate: '',
    tel: '',
    no: '',
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  };

  const windowWidth = Dimensions.get('window').width;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const [subDistrict, setSubDistrict] = useState<any>();
  const [province, setProvince] = useState<any>();
  const [district, setDistrict] = useState<any>();
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [itemsSubDistrict, setItemSubDistrict] = useState<
    {
      value: string;
      label: string;
      postcode: string;
    }[]
  >([]);
  const [image, setImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [showModalSelectImage, setShowModalSelectImage] = useState(false);
  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );

  const getProfile = async () => {
    setLoadingFetch(true);
    const droner_id = await AsyncStorage.getItem('droner_id');

    ProfileDatasource.getProfile(droner_id!)
      .then(async res => {
        const datetime = res.birthDate;
        let date = null;
        if (datetime) {
          date = moment(datetime).toISOString();
          setBirthday(date);
        }
        setProvince({
          label: '',
          value: res.address.provinceId,
        });
        setDistrict({
          label: '',
          value: res.address.districtId,
        });
        setSubDistrict({
          label: '',
          value: res.address.subdistrictId,
        });
        dispatch({
          type: 'Initial Input',
          name: res.firstname,
          surname: res.lastname,
          birthDate: date,
          tel: res.telephoneNo,
          no: res.address.address1 === '-' ? '' : res.address.address1,
          address: res.address.address2 === '-' ? '' : res.address.address2,
          province: res.address.provinceId,
          district: res.address.districtId,
          subdistrict: res.address.subdistrictId,
          postal: res?.address?.postcode === '-' ? '' : res?.address?.postcode,
          nickname: res.nickname,
        });
        const findProfileImage = res.file.find(
          (el: {category: string}) => el.category === 'PROFILE_IMAGE',
        );
        if (findProfileImage) {
          await ProfileDatasource.getImgePath(droner_id!, findProfileImage.path)
            .then(resImg => {
              setImagePreview({
                path: findProfileImage.path,
                uri: resImg.url,
                id: findProfileImage.id,
              });
            })
            .catch(err => console.log(err))
            .finally(() => setLoadingFetch(false));
        }
        setLoadingFetch(false);
      })
      .catch(err => console.log(err));
  };
  const onFinishedTakePhoto = useCallback(async (v: any) => {
    const isFileMoreThan5MB = v.assets[0].fileSize > 5 * 1024 * 1024;
    if (isFileMoreThan5MB) {
      setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 5 MB');
      return false;
    }
    setError('');
    setImage(v);

    setShowModalSelectImage(false);
  }, []);
  const onAddImageStorage = async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      multiple: false,
      maxFiles: 1,
    });
    setError('');
    if (result) {
      const fileSize = result.size / 1024 / 1024;
      const isMoreThan4MB = fileSize > 4;
      if (isMoreThan4MB) {
        setError('รูปภาพมีขนาดใหญ่เกิน 4 MB');
        return;
      }

      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setShowModalSelectImage(false);
    }
    return;
  };
  // const onAddImageStorage = async () => {
  //   const result = await ImagePicker.launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 0.8,
  //   });
  //   if (!result.didCancel) {
  //     const fileSize = result?.assets?.[0]?.fileSize;
  //     if (!fileSize) {
  //       setError('รูปภาพไม่ถูกต้อง');
  //       return;
  //     }
  //     const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
  //     const isFileMoreThan3MB = fileSize > 3 * 1024 * 1024;
  //     let newResult: any = result;

  //     if (isFileMoreThan20MB) {
  //       setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');

  //       return false;
  //     }
  //     if (isFileMoreThan3MB) {
  //       const newImage: any = await ResizeImage({
  //         uri: result?.assets ? result?.assets?.[0].uri : '',
  //       });
  //       newResult = {
  //         assets: [
  //           {
  //             ...newImage,
  //             fileSize: newImage.size,
  //             type: 'image/jpeg',
  //             fileName: newImage?.name ? `${newImage.name}`.toLowerCase() : '',
  //           },
  //         ],
  //       };
  //     }
  //     setImage(newResult);

  //     setError('');
  //     setShowModalSelectImage(false);
  //   }
  //   return;
  // };
  // const onTakeImage = async () => {
  //   const result = await ImagePicker.launchCamera({
  //     mediaType: 'photo',
  //     maxHeight: 800,
  //     maxWidth: 800,
  //     cameraType: 'back',
  //     quality: 0.8,
  //   });

  //   if (!result.didCancel) {
  //     const fileSize = result?.assets?.[0]?.fileSize || 0;
  //     const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
  //     const isFileMoreThan3MB = fileSize > 3 * 1024 * 1024;
  //     let newResult: any = result;

  //     if (isFileMoreThan20MB) {
  //       setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');
  //       return false;
  //     }
  //     if (isFileMoreThan3MB) {
  //       const newImage: any = await ResizeImage({
  //         uri: result?.assets ? result?.assets?.[0].uri : '',
  //       });
  //       newResult = {
  //         assets: [
  //           {
  //             ...newImage,
  //             fileSize: newImage.size,
  //             type: 'image/jpeg',
  //             fileName: newImage.name,
  //           },
  //         ],
  //       };
  //     }
  //     setImage(newResult);

  //     setError('');
  //     setShowModalSelectImage(false);
  //   }
  // };
  const onTakeImage = useCallback(async () => {
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      cropping: true,
    }).catch(err => {
      crashlytics().log('EditProfileScreen_onPressCamera_tapped');
      crashlytics().recordError(err);
    });
    setError('');
    if (result) {
      const fileSize = result.size / 1024 / 1024;
      const isMoreThan4MB = fileSize > 4;
      if (isMoreThan4MB) {
        setError('รูปภาพมีขนาดใหญ่เกิน 4 MB');
        return;
      }

      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setShowModalSelectImage(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
    QueryLocation.QueryProvince().then(res => {
      const Province = res
        .map((item: any) => {
          return {label: item.provinceName, value: item.provinceId};
        })
        .sort((a: any, b: any) => a.label.localeCompare(b.label));

      setItems(Province);
    });
  }, []);

  useEffect(() => {
    if (province != null) {
      QueryLocation.QueryDistrict(province.value).then(res => {
        const District = res
          .map((item: any) => {
            return {label: item.districtName, value: item.districtId};
          })
          .sort((a: any, b: any) => a.label.localeCompare(b.label));

        setItemDistrict(District);
      });
    }
  }, [province]);

  useEffect(() => {
    if (province != null && district != null) {
      QueryLocation.QuerySubDistrict(district.value, district.label).then(
        res => {
          const SubDistrict = res
            .map((item: any) => {
              return {
                label: item.subdistrictName,
                value: item.subdistrictId,
                postcode: item.postcode,
              };
            })
            .sort((a: any, b: any) => a.label.localeCompare(b.label));

          setItemSubDistrict(SubDistrict);
        },
      );
    }
  }, [province, district]);

  const {disableInputList, isDisableMainButton} = useMemo(() => {
    const isDisableMainButton =
      !formState.name ||
      !formState.surname ||
      !formState.tel ||
      !formState.no ||
      !formState.address ||
      !formState.province ||
      !formState.district ||
      !formState.subdistrict ||
      !formState.postal ||
      !formState.nickname;
    return {
      isDisableMainButton,
      disableInputList: [
        {
          label: 'ชื่อ',
          value: formState.name,
          isEditable: false,
        },
        {
          label: 'นามสกุล',
          value: formState.surname,
          isEditable: false,
        },
        {
          label: 'ชื่อเล่น (ชื่อที่เกษตรเรียก)',
          value: formState.nickname ? formState.nickname : '',
          isEditable: true,
        },
        {
          label: 'เบอร์โทรศัพท์',
          value: formState.tel,
          isEditable: false,
        },
      ],
    };
  }, [formState]);

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="แก้ไขโปรไฟล์"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('EditProfileScreen_BackButton_Press');
          navigation.goBack();
        }}
      />

      <ScrollView>
        <View style={styles.inner}>
          <View style={styles.container}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(40),
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowModalSelectImage(true);
                }}>
                <View
                  style={{
                    width: normalize(116),
                    height: normalize(116),
                    borderRadius: normalize(58),
                    position: 'relative',
                    backgroundColor: colors.white,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  {loadingFetch ? (
                    <SkeletonPlaceholder
                      speed={2000}
                      backgroundColor={colors.skeleton}>
                      <SkeletonPlaceholder.Item borderRadius={58}>
                        <View
                          style={{
                            width: normalize(116),
                            height: normalize(116),
                            borderRadius: normalize(58),
                          }}
                        />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                  ) : (
                    <>
                      <ProgressiveImage
                        source={
                          image
                            ? {uri: image?.assets?.[0].uri}
                            : imagePreview
                            ? {uri: imagePreview.uri}
                            : icons.account
                        }
                        style={{
                          width: normalize(116),
                          height: normalize(116),
                          borderRadius: normalize(58),
                        }}
                      />
                      {error && (
                        <View
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 8,
                          }}>
                          <Text
                            style={{
                              fontFamily: font.medium,
                              fontSize: normalize(14),
                              color: colors.decreasePoint,
                            }}>
                            {error}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                  <View
                    style={{
                      position: 'absolute',
                      right: 8,
                      bottom: 0,
                      width: normalize(32),
                      height: normalize(32),
                      borderRadius: normalize(16),
                      backgroundColor: colors.white,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 1.84,
                      elevation: 5,
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
            {disableInputList.map(el => {
              if (el.isEditable) {
                return (
                  <AnimatedInput
                    blurPosition={5}
                    maxLength={50}
                    label={el.label}
                    onBlur={() => {
                      mixpanel.track('EditProfileScreen_Nickname_Input', {
                        value: formState.nickname,
                      });
                    }}
                    value={el.value}
                    onChangeText={value => {
                      const newValue = mixValidator(value);

                      dispatch({
                        type: 'Handle Input',
                        field: 'nickname',
                        payload: newValue,
                      });
                    }}
                    style={{
                      marginBottom: 0,
                    }}
                    stylesInput={{
                      borderRadius: normalize(10),
                      height: normalize(56),
                    }}
                    suffix={<InfoCircle sheetId="nicknameSheet" />}
                  />
                );
              }
              return (
                <View
                  style={[styles.input, {backgroundColor: colors.softGrey2}]}>
                  <Text style={styles.label}>{el.label}</Text>
                  <Text style={styles.valueInput}>{el.value}</Text>
                </View>
              );
            })}

            <View style={{marginTop: normalize(16)}}>
              <Text style={styles.h1}>ที่อยู่</Text>
            </View>
            {/* <TextInput
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
              open={openSubDistrict}
              value={valueSubDistrict}
              items={itemsSubDistrict}
              setOpen={setOpenSubDistrict}
              onSelectItem={(value: any) => {
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
              setValue={setSubDistrict}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <TextInput
              value={formState.postal}
              style={[styles.input, {backgroundColor: colors.disable}]}
              editable={false}
              placeholder={'รหัสไปรษณีย์'}
            /> */}
            <View style={styles.container}>
              <AnimatedInput
                label="บ้านเลขที่"
                value={formState.no}
                onBlur={() => {
                  mixpanel.track('EditProfileScreen_HouseNo_Input', {
                    value: formState.no,
                  });
                }}
                onChangeText={value => {
                  dispatch({
                    type: 'Handle Input',
                    field: 'no',
                    payload: value,
                  });
                }}
              />
              <AnimatedInput
                label="รายละเอียดที่อยู่ (หมู่, ถนน)"
                value={formState.address}
                onBlur={() => {
                  mixpanel.track('EditProfileScreen_Address_Input', {
                    value: formState.address,
                  });
                }}
                onChangeText={value => {
                  dispatch({
                    type: 'Handle Input',
                    field: 'address',
                    payload: value,
                  });
                }}
              />
              <Dropdown
                placeholder="จังหวัด"
                items={items}
                value={province?.value}
                onChange={(v: {label: string; value: string}) => {
                  mixpanel.track('EditProfileScreen_Province_Input', {
                    value: v.value,
                    label: v.label,
                  });
                  setProvince(v);
                  setDistrict('');
                  setSubDistrict('');
                  dispatch({
                    type: 'Handle Input',
                    field: 'postal',
                    payload: '',
                  });

                  dispatch({
                    type: 'Handle Input',
                    field: 'province',
                    payload: v.value,
                  });
                }}
              />
              <View
                style={{
                  zIndex: -10,
                }}>
                <Dropdown
                  placeholder="อำเภอ"
                  items={itemsDistrict}
                  value={district?.value}
                  onChange={(v: {label: string; value: string}) => {
                    mixpanel.track('EditProfileScreen_District_Input', {
                      value: v.value,
                      label: v.label,
                    });
                    setDistrict(v);
                    setSubDistrict('');
                    dispatch({
                      type: 'Handle Input',
                      field: 'postal',
                      payload: '',
                    });

                    dispatch({
                      type: 'Handle Input',
                      field: 'district',
                      payload: v.value,
                    });
                  }}
                />
              </View>
              <View
                style={{
                  zIndex: -20,
                }}>
                <Dropdown
                  placeholder="ตำบล"
                  items={itemsSubDistrict}
                  value={subDistrict?.value}
                  onChange={(v: {label: string; value: string}) => {
                    mixpanel.track('EditProfileScreen_SubDistrict_Input', {
                      value: v.value,
                      label: v.label,
                      postCode: itemsSubDistrict.find(
                        el => el.value === v.value,
                      )?.postcode,
                    });
                    setSubDistrict(v);
                    dispatch({
                      type: 'Handle Input',
                      field: 'subdistrict',
                      payload: v.value,
                    });
                    dispatch({
                      type: 'Handle Input',
                      field: 'postal',
                      payload: itemsSubDistrict.find(el => el.value === v.value)
                        ?.postcode,
                    });
                  }}
                />
              </View>
              <View
                style={{
                  zIndex: -30,
                }}>
                <AnimatedInput
                  editable={false}
                  label="รหัสไปรษณีย์"
                  value={formState.postal}
                />
              </View>
              <View
                style={{
                  zIndex: -40,
                  height: normalize(56),
                }}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.white,
              zIndex: -30,
              paddingBottom: 16,
            }}>
            <AsyncButton
              title="บันทึก"
              disabled={isDisableMainButton}
              onPress={async () => {
                setLoading(true);
                const payload = {
                  address1: formState.no,
                  address2: formState.address,
                  districtId: formState.district,
                  provinceId: formState.province,
                  subdistrictId: formState.subdistrict,
                  postcode: formState.postal,
                  firstname: formState.name,
                  lastname: formState.surname,
                  telephoneNo: formState.tel,
                  birthDate: formState.birthDate ? formState.birthDate : null,
                  nickname: formState.nickname,
                };

                await Authentication.updateProfile(payload)
                  .then(async () => {
                    if (imagePreview?.path && image) {
                      await Authentication.removeProfileImage({
                        id: imagePreview?.id,
                        path: imagePreview.path,
                      });
                    }
                    if (image) {
                      try {
                        await Authentication.updateProfileImage(image);
                      } catch (err) {
                        console.log(err);
                      }
                    }
                    navigation.goBack();
                  })
                  .catch(err => {
                    console.log(err);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
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
          <ModalUploadImage
            onCloseModalSelect={() => {
              setShowModalSelectImage(false);
            }}
            onFinishedTakePhoto={onFinishedTakePhoto}
            onCancel={() => {
              setShowModalSelectImage(false);
            }}
            onPressLibrary={onAddImageStorage}
            onPressCamera={() => {
              onTakeImage();
            }}
            visible={showModalSelectImage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfile;

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
    fontFamily: font.medium,
    fontSize: normalize(14),
    color: colors.gray,
    marginBottom: 4,
  },
  container: {
    flex: 1,
    marginTop: 16,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    paddingTop: 4,
    paddingHorizontal: 14,
    borderColor: colors.grey3,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
  valueInput: {
    fontFamily: font.semiBold,
    fontSize: normalize(16),
    color: colors.gray,
  },
});
