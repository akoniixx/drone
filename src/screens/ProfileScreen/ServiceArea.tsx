import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {colors, font, icons, image} from '../../assets';
import {normalize} from '@rneui/themed';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {MainButton} from '../../components/Button/MainButton';
import fonts from '../../assets/fonts';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import Text from '../../components/Text';

interface AreaServiceEntity {
  area: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  locationName: string;
}

const ServiceArea: React.FC<any> = ({navigation, route}) => {
  const [position, setPosition] = useState({
    latitude: parseFloat(route.params.lat),
    longitude: parseFloat(route.params.long),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [edit, setEdit] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<AreaServiceEntity[]>([]);
  const [dataStore, setDataStore] = useState<AreaServiceEntity[]>([]);
  const [dataRender, setDataRender] = useState<AreaServiceEntity[]>([]);
  const [searchResult, setSearchResult] = useState<string>(route.params.area);
  const [positionForm, setPositionForm] = useState<AreaServiceEntity>({
    area: route.params.area,
    latitude: route.params.lat,
    longitude: route.params.long,
    provinceId: route.params.provinceId,
    districtId: route.params.districtId,
    subdistrictId: route.params.subdistrictId,
    locationName: route.params.locationName,
  });

  const onChangeText = (text: string) => {
    setSearchActive(text);
  };

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

  useEffect(() => {
    getNameFormLat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    setTimeout(() => {
      setPosition({
        ...position,
        latitude: position.latitude,
        longitude: position.longitude,
      });
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [searchActive, data]);

  useEffect(() => {
    let arr = [];
    let skip = dataStore.length;
    for (
      let i = 20 * page;
      i < (20 + 20 * page > skip ? skip : 20 + 20 * page);
      i++
    ) {
      arr.push(dataStore[i]);
    }
    let newarr = dataRender.concat(arr);
    setDataRender(newarr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
        setPositionForm({
          ...positionForm,
          latitude: responseJson.results[0].geometry.location.lat,
          longitude: responseJson.results[0].geometry.location.lng,
          locationName:
            responseJson.results[0].address_components[0].long_name +
            ' ' +
            responseJson.results[0].address_components[2].long_name +
            ' ' +
            responseJson.results[0].address_components[3].long_name +
            ' ' +
            responseJson.results[0].address_components[4].long_name,
        });
        QueryLocation.QueryProvince()
          .then(item => {
            item.map((Province: any) => {
              if (
                Province.provinceName ==
                `จังหวัด${responseJson.results[0].address_components[3].long_name}`
              ) {
                setPositionForm({
                  ...positionForm,
                  provinceId: Province.provinceId,
                });
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
                        setPositionForm({
                          ...positionForm,
                          districtId: District.districtId,
                        });
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
                                setPositionForm({
                                  ...positionForm,
                                  subdistrictId: SubDistrict.subdistrictId,
                                });
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

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[stylesCentral.container]}>
          <CustomHeader
            showBackBtn={true}
            onPressBack={() => (edit ? setEdit(false) : navigation.goBack())}
            title={edit ? 'พื้นที่ให้บริการหลัก' : 'พื้นที่ให้บริการ'}
          />
          {edit ? (
            <View
              style={{
                flex: 1,
                paddingHorizontal: normalize(17),
                paddingTop: normalize(10),
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
                  clearButtonMode={'always'}
                  allowFontScaling={false}
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
                              longitude: parseFloat(item.longitude.toString()),
                            });
                            setPositionForm({
                              ...positionForm,
                              area: item.area,
                              latitude: parseFloat(item.latitude.toString()),
                              longitude: parseFloat(item.longitude.toString()),
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
                  padding: normalize(17),
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
                    }}>
                    พื้นที่ให้บริการหลัก
                  </Text>
                </View>
                <Pressable onPress={() => setEdit(true)}>
                  <View style={[styles.input, {marginVertical: normalize(20)}]}>
                    <Text style={styles.label}>ตำบล/ อำเภอ/ จังหวัด</Text>
                    <Text style={styles.inputvalue}>{searchResult}</Text>
                  </View>
                </Pressable>
                <Text style={styles.inputvalue}>
                  ระยะทางพื้นที่ให้บริการหลักระหว่าง 50-100 กม.
                </Text>
                <View style={{position: 'relative'}}>
                  <MapView.Animated
                    mapType={'satellite'}
                    zoomEnabled={true}
                    minZoomLevel={14}
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
              <View
                style={{
                  paddingHorizontal: normalize(17),
                }}>
                <MainButton
                  disable={positionForm.provinceId === 0}
                  onPress={() => {
                    ProfileDatasource.editServiceArea(
                      positionForm.area,
                      positionForm.latitude,
                      positionForm.longitude,
                      positionForm.provinceId,
                      positionForm.districtId,
                      positionForm.subdistrictId,
                      positionForm.locationName,
                    ).then(() => navigation.goBack());
                  }}
                  label="บันทึก"
                  color={colors.orange}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ServiceArea;

const styles = StyleSheet.create({
  input: {
    height: normalize(56),
    marginVertical: normalize(12),
    justifyContent: 'center',
    paddingHorizontal: normalize(12),
    borderColor: colors.disable,
    borderWidth: normalize(1),
    borderRadius: normalize(10),
    fontFamily: font.regular,
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    color: colors.fontBlack,
    fontSize: normalize(12),
  },
  inputvalue: {
    fontFamily: font.regular,
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
  map: {
    width: '100%',
    height: normalize(190),
    borderRadius: normalize(12),
    marginTop: normalize(20),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '55%',
  },
  marker: {
    height: normalize(31),
    width: normalize(26),
  },
  markerArea: {
    width: normalize(150),
    height: normalize(150),
  },
  markerField: {
    position: 'absolute',
    left: '21.5%',
    top: '11.5%',
    width: normalize(150),
    height: normalize(150),
  },
});
