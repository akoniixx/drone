import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {useAuth} from '../../contexts/AuthContext';
import ActionSheet from 'react-native-actions-sheet';
import {normalize} from '../../function/Normalize';
import {colors, font, icons, image} from '../../assets';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import {mixpanel} from '../../../mixpanel';
import Lottie from 'lottie-react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import {MainButton} from '../../components/Button/MainButton';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../../components/Text';
import ListDrone from './ListDrone';

interface Props {
  navigation: any;
}
export default function DroneListScreen({navigation}: Props) {
  const {
    authContext: {getProfileAuth},
  } = useAuth();
  const actionSheet = useRef<any>(null);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const [loading, setLoading] = useState(false);
  const [image1, setImage1] = useState<any>(null);
  const [image2, setImage2] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [opentype, setOpentype] = useState(false);
  const [value, setValue] = useState(null);
  const [valuetype, setValuetype] = useState(null);
  const [droneno, setdroneno] = useState<any>(null);
  const [popupPage, setpopupPage] = useState(1);
  const [brand, setBrand] = useState<any>(null);
  const [brandtype, setBrandType] = useState<any>(null);
  const [itemstype, setItemstype] = useState<any>([]);
  const [items, setItems] = useState<any>([]);

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

  const addDrone = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    mixpanel.track('ProfileScreen_AddDrone_Confirm_Press', {
      brand: brand.value,
      type: brandtype.value,
      serial: droneno,
      dronerId: droner_id,
    });
    const newDrone = {
      dronerId: droner_id,
      droneId: brandtype.value,
      serialNo: droneno,
      status: 'PENDING',
    };
    setLoading(true);
    ProfileDatasource.addDronerDrone(newDrone)
      .then(async () => {
        setImage1(null);
        setImage2(null);
        setBrand(null);
        setBrandType(null);
        setpopupPage(1);
        setdroneno(null);
        setValue(null);
        setValuetype(null);
        setLoading(false);
        setItemstype([]);
        actionSheet.current.hide();
        await getProfileAuth();
      })
      .catch(err => console.log(err));
  };
  const showActionSheet = () => {
    mixpanel.track('ProfileScreen_AddDrone_Press');
    actionSheet.current.show();
  };

  useEffect(() => {
    ProfileDatasource.getDroneBrand(1, 14)
      .then(result => {
        const data = result.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            image: item.logoImagePath,
            containerStyle: {
              height: 50,
            },
            icon: () =>
              item.logoImagePath != null ? (
                <Image
                  source={{uri: item.logoImagePath}}
                  style={{width: 36, height: 36, borderRadius: 18}}
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
      ProfileDatasource.getDroneBrandType(brand.value)
        .then(result => {
          const data = result.drone.map((item: any) => {
            return {
              label: item.series,
              value: item.id,
              containerStyle: {
                height: 50,
              },
            };
          });
          setItemstype(data);
        })
        .catch(err => console.log(err));
    }
  }, [brand]);

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
      }}>
      <CustomHeader
        title={'โดรนของฉัน'}
        showBackBtn={true}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addNewDronerButton}
          onPress={showActionSheet}>
          <Text style={styles.textButton}>
            <Image
              source={icons.orangePlus}
              resizeMode="contain"
              style={{
                width: normalize(20),
                height: normalize(20),
                marginRight: normalize(16),
              }}
            />
            เพิ่มโดรน
          </Text>
        </TouchableOpacity>
        <ListDrone />
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
        containerStyle={{
          height: windowHeight * 0.8,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: normalize(16),
            width: windowWidth,
            height: '100%',
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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: normalize(16),
                    marginBottom: 8,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.gray,
                    paddingBottom: 16,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      actionSheet.current.hide();
                      setBrand(null);
                      setBrandType(null);
                      setValuetype(null);
                      setValue(null);
                    }}>
                    <Image
                      source={icons.close}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </TouchableOpacity>

                  <Text style={styles.hSheet}>เพิ่มโดรน</Text>
                  <View />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: normalize(16),
                  }}>
                  <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.h2}>ยี่ห้อโดรน</Text>
                      <Text
                        style={[
                          styles.h2,
                          {color: colors.grey2, paddingLeft: 4},
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
                        textStyle={{
                          fontFamily: font.medium,
                          fontSize: normalize(16),
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        style={{
                          marginVertical: 10,
                          backgroundColor: colors.white,
                          borderColor: colors.borderInput,
                          height: normalize(50),
                        }}
                        placeholder="เลือกยี่ห้อโดรน"
                        placeholderStyle={{
                          color: colors.grey2,
                          fontFamily: font.medium,
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        onSelectItem={v => {
                          setBrand(v);
                          setBrandType(null);
                          setValuetype(null);
                        }}
                        listItemLabelStyle={{
                          fontFamily: font.medium,
                        }}
                        setValue={setValue}
                        dropDownDirection="BOTTOM"
                        bottomOffset={200}
                        dropDownContainerStyle={{
                          borderColor: colors.disable,
                          maxHeight: 200,
                          overflow: 'visible',
                          backgroundColor: colors.white,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
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
                          borderColor: colors.borderInput,
                          height: normalize(50),
                        }}
                        textStyle={{
                          fontFamily: font.medium,
                          fontSize: normalize(16),
                        }}
                        placeholder="รุ่น"
                        placeholderStyle={{
                          color: colors.grey2,
                          fontFamily: font.medium,
                        }}
                        open={opentype}
                        value={valuetype}
                        items={itemstype}
                        setOpen={setOpentype}
                        onSelectItem={v => {
                          setBrandType(v);
                        }}
                        setValue={setValuetype}
                        dropDownDirection="BOTTOM"
                        dropDownContainerStyle={{
                          borderColor: colors.disable,
                          maxHeight: 200,
                          overflow: 'visible',
                          backgroundColor: colors.white,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                        listItemLabelStyle={{
                          fontFamily: font.medium,
                        }}
                        ListEmptyComponent={() => (
                          <View
                            style={{
                              height: 50,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                              }}>
                              ไม่พบรุ่นโดรน กรุณาเลือกยี่ห้อโดรน
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                  </ScrollView>
                </View>

                <View
                  style={{
                    paddingHorizontal: normalize(16),
                  }}>
                  <MainButton
                    disable={!brand || !brandtype ? true : false}
                    label="เพิ่ม"
                    color={colors.orange}
                    onPress={addDrone}
                    style={{
                      height: normalize(53),
                    }}
                  />
                </View>
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
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.hSheet}>เพิ่มเอกสาร</Text>
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
                    onPress={() => {}}
                  />
                </View>
              </View>
            )}
          </View>
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
      </ActionSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  hSheet: {
    fontFamily: font.bold,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  addNewDronerButton: {
    width: '100%',
    minHeight: normalize(53),
    backgroundColor: colors.transOrange,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontFamily: font.bold,
    fontSize: normalize(20),
    color: colors.orange,
  },
});
