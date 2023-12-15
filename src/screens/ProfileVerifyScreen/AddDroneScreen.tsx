import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@rneui/themed';
import colors from '../../assets/colors/colors';
import {font, icons} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import ActionSheet from 'react-native-actions-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import Lottie from 'lottie-react-native';
import image from '../../assets/images/image';
import {Register} from '../../datasource/AuthDatasource';
import DroneBrandingItem from '../../components/Drone/DroneBranding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import Text from '../../components/Text';

const AddDroneScreen: React.FC<any> = ({navigation}) => {
  const actionSheet = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;
  const [items, setItems] = useState<any>([]);
  const [brand, setBrand] = useState<any>(null);
  const [brandtype, setBrandType] = useState<any>(null);
  const [itemstype, setItemstype] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [opentype, setOpentype] = useState(false);
  const [value, setValue] = useState(null);
  const [valuetype, setValuetype] = useState(null);
  const [dronedataUI, setDronedataUI] = useState<any>([]);
  const [dronedata, setDronedata] = useState<any>([]);
  const [count, setCount] = useState(1);
  const [droneIndex, setDroneIndex] = useState(1);
  const [drone, setDrone] = useState<any>();
  const [percentSuccess, setPercentSuccess] = useState<any>();

  const showActionSheet = () => {
    actionSheet.current.show();
  };
  useEffect(() => {
    const getProfile = async () => {
      const droner_id = await AsyncStorage.getItem('droner_id');
      ProfileDatasource.getProfile(droner_id!).then(res => {
        setDrone(res.dronerDrone);
        setPercentSuccess(res.percentSuccess);
      });
    };
    getProfile();
  }, []);
  useEffect(() => {
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
  const incrementCount = () => {
    setCount(count + 1);
    setDroneIndex(droneIndex + 1);
  };
  const addDrone = async () => {
    const drones = [...dronedata];
    const dronesUI = [...dronedataUI];
    const newDrone = {
      droneId: brandtype.value,
      status: 'PENDING',
    };
    const newDroneUI = {
      img: brand.image,
      droneBrand: brandtype.label,
    };
    drones.push(newDrone);
    dronesUI.push(newDroneUI);
    setValue(null);
    setValuetype(null);
    setDronedata(drones);
    setDronedataUI(dronesUI);
    setBrand(null);
    setBrandType(null);
    actionSheet.current.hide();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title={'เพิ่มโดรน'}
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View style={{padding: 20, flexDirection: 'row'}}>
            <Text style={[styles.text]}>โดรนของคุณ</Text>
          </View>
          <ScrollView>
            {drone && (
              <View
                style={{
                  marginTop: normalize(10),
                  display: 'flex',
                  justifyContent: 'center',
                  paddingHorizontal: normalize(15),
                }}>
                {drone.map((item: any, index: number) => (
                  <DroneBrandingItem
                    key={index}
                    dronebrand={item.drone.droneBrand.name}
                    serialbrand={item.serialNo}
                    status={'PENDING'}
                    image={item.drone.droneBrand.logoImagePath}
                  />
                ))}
              </View>
            )}
            {dronedataUI.length === 0 && dronedata.length === 0 ? (
              <></>
            ) : (
              <View
                style={{
                  marginTop: normalize(10),
                  display: 'flex',
                  justifyContent: 'center',
                  paddingHorizontal: normalize(15),
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
            <View style={{paddingHorizontal: normalize(15)}}>
              <MainButton
                label="+ เพิ่มโดรน"
                fontColor={colors.orange}
                color={'#FFEAD1'}
                onPress={showActionSheet}
              />
            </View>
          </ScrollView>
        </View>

        <View style={{paddingHorizontal: normalize(17)}}>
          <MainButton
            label="บันทึก"
            color={!dronedata.length ? colors.disable : colors.orange}
            disable={!dronedata.length}
            onPress={async () => {
              setLoading(true);
              incrementCount();
              Register.uploadDronerdrone(dronedata, Number(percentSuccess) + 25)
                .then(() => {
                  setLoading(false);
                  setBrand(null);
                  setBrandType(null);
                  setValue(null);
                  setValuetype(null);
                  setLoading(false);
                  navigation.goBack();
                })
                .catch(err => console.log(err));
            }}
          />
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
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    padding: normalize(8),
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
                      source={icons.closeX}
                      style={{
                        width: normalize(14),
                        height: normalize(14),
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textAddDrone}>เพิ่มโดรน</Text>
                  <View />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4,
                    paddingVertical: 16,
                  }}>
                  <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.text}>ยี่ห้อโดรนฉีดพ่น</Text>
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
                          fontFamily: font.regular,
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        onSelectItem={v => {
                          setBrand(v);
                        }}
                        setValue={setValue}
                        dropDownDirection="BOTTOM"
                        bottomOffset={200}
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
                          fontFamily: font.regular,
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
                        }}
                      />
                    </View>
                  </ScrollView>
                </View>
                <MainButton
                  disable={!brand || !brandtype ? true : false}
                  label="เพิ่ม"
                  color={colors.orange}
                  onPress={addDrone}
                />
              </View>
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
    </TouchableWithoutFeedback>
  );
};

export default AddDroneScreen;
const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: normalize(17),
  },
  text: {
    fontSize: normalize(16),
    fontFamily: font.medium,
  },
  textAddDrone: {
    fontFamily: font.bold,
    fontSize: normalize(20),
    color: colors.fontBlack,
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
    fontFamily: font.regular,
  },
});
