import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons} from '../../assets';
import {normalize} from '../../function/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Authentication} from '../../datasource/AuthDatasource';
import * as RootNavigation from '../../navigations/RootNavigation';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {initProfileState, profileReducer} from '../../hooks/profilefield';
import {StatusObject} from '../../components/Drone/DroneBranding';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionSheet from 'react-native-actions-sheet';
import {useAuth} from '../../contexts/AuthContext';
import {numberWithCommas, socket} from '../../function/utility';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import {QueryLocation} from '../../datasource/LocationDatasource';
import Geolocation from 'react-native-geolocation-service';
import Text from '../../components/Text';
import Spinner from 'react-native-loading-spinner-overlay';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import {RefreshControl} from 'react-native';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import {mixpanel} from '../../../mixpanel';
import SwitchReceiveTask from './ProfileScreenComponent/SwitchReceiveTask';
import DronerList from './ProfileScreenComponent/DronerList';

const ProfileScreen: React.FC<any> = ({navigation, route}) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const {
    authContext: {getProfileAuth, getNotiList},
    state: {isDoneAuth, user, countNoti = 0},
  } = useAuth();

  const backbotton = !route.params ? true : route.params.navbar;

  const [reload, setReload] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('fcmtoken');
    setFcmToken(token!);
  };

  const getInitialData = async () => {
    setLoadingProfile(true);
    await Promise.all([
      getProfile(),
      getToken(),
      getNotiList(),
      getNotiList,
    ]).finally(() => setLoadingProfile(false));
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getInitialData();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const onLogout = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    mixpanel.track('ProfileScreen_Logout_Press', {
      dronerId: dronerId,
    });
    FCMtokenDatasource.deleteFCMtoken(fcmToken)
      .then(async () => {
        socket.removeAllListeners(`send-task-${dronerId!}`);
        socket.close();
        await Authentication.logout();
      })
      .catch(err => console.log(err));
  };

  const getProfile = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) || '';

    getProfileAuth()
      .then(res => {
        const imgPath = res?.file?.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        if (imgPath.length === 0) {
          ProfileDatasource.getTaskrevenuedroner()
            .then(resRev => {
              dispatch({
                type: 'InitProfile',
                name: `${res.firstname} ${res.lastname}`,
                id: res.dronerCode,
                image: '',
                droneitem: res.dronerDrone,
                status: res.status,
                totalRevenue: resRev.totalRevenue,
                nickname: res.nickname,
                rating: !resRev.ratingAvg
                  ? '0.0'
                  : parseFloat(resRev.ratingAvg).toFixed(1).toString(),
              });
            })
            .catch(err => console.log(err));
        } else {
          ProfileDatasource.getImgePath(droner_id!, imgPath[0].path)
            .then(resImg => {
              ProfileDatasource.getTaskrevenuedroner()
                .then(resRev => {
                  dispatch({
                    type: 'InitProfile',
                    name: `${res.firstname} ${res.lastname}`,
                    id: res.dronerCode,
                    image: resImg.url,
                    droneitem: res.dronerDrone,
                    status: res.status,
                    totalRevenue: resRev.totalRevenue,
                    nickname: res.nickname,
                    rating: !resRev.ratingAvg
                      ? '0.0'
                      : parseFloat(resRev.ratingAvg).toFixed(1).toString(),
                  });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView
      style={[
        stylesCentral.container,
        {
          backgroundColor: colors.white,
        },
      ]}
      edges={['right', 'top', 'left']}>
      <View style={styles.appBarBack}>
        {backbotton ? (
          <View
            style={{
              width: 24,
            }}
          />
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
            <Image source={icons.arrowLeft} style={styles.listTileIcon} />
          </TouchableOpacity>
        )}
        <Text style={[styles.appBarHeader]}>โปรไฟล์ของฉัน</Text>
        <View style={styles.listTileIcon} />
      </View>

      <NetworkLost onPress={onRefresh}>
        <View style={[styles.body]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.profile}>
              <View style={styles.profileDescription}>
                <ProgressiveImage
                  borderRadius={40}
                  source={
                    profilestate?.image === ''
                      ? icons.account
                      : {uri: profilestate.image}
                  }
                  style={{
                    width: normalize(80),
                    height: normalize(80),
                    borderRadius: normalize(40),
                  }}
                />
                <View style={styles.profileName}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: normalize(18),
                      paddingBottom: normalize(2),
                      color: colors.fontBlack,
                    }}>
                    {profilestate.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.medium,
                      fontSize: normalize(16),
                      color: colors.fontBlack,
                      paddingBottom: normalize(5),
                    }}>
                    {profilestate.nickname ? profilestate.nickname : '-'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: normalize(12),
                      color: colors.gray,
                      paddingBottom: normalize(5),
                    }}>
                    {profilestate.id}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={styles.review}>
                      <Text
                        style={{
                          fontFamily: font.medium,
                          color: colors.white,
                          fontSize: normalize(11),
                        }}>
                        {profilestate.rating}
                      </Text>
                      <Image
                        source={icons.review}
                        style={{
                          width: normalize(12),
                          height: normalize(12),
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: normalize(109),
                        height: normalize(24),
                        borderWidth: 1,
                        borderColor: StatusObject(profilestate.status)
                          .fontColor,
                        borderRadius: normalize(12),
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: StatusObject(profilestate.status)
                          .colorBg,
                      }}>
                      <Text
                        style={{
                          color: StatusObject(profilestate.status).fontColor,
                          fontFamily: font.semiBold,
                          fontSize: normalize(14),
                        }}>
                        {StatusObject(profilestate.status).status ===
                        'ตรวจสอบแล้ว'
                          ? 'ยืนยันตัวตนแล้ว'
                          : StatusObject(profilestate.status).status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 16,
                }}>
                {profilestate.status != 'ACTIVE' ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditProfile');
                    }}>
                    <Image
                      source={icons.editProfile}
                      style={{
                        width: normalize(22),
                        height: normalize(22),
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditProfile');
                    }}>
                    <Image
                      source={icons.editProfile}
                      style={{
                        width: normalize(22),
                        height: normalize(22),
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {profilestate.status === 'REJECTED' ? (
              <View style={styles.commentBg}>
                <Text style={styles.commentFront}>
                  หมายเหตุ : บัตรประชาชนไม่ชัดเจน/ไม่ถูกต้อง
                  กรุณาติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข โทร. 02-233-9000
                </Text>
              </View>
            ) : profilestate.status === 'INACTIVE' ? (
              <View style={styles.commentBg}>
                <Text style={styles.commentFront}>
                  หมายเหตุ : หากต้องการเปิดใช้งานบัญชี กรุณาติดต่อเจ้าหน้าที่
                  โทร. 02-233-9000
                </Text>
              </View>
            ) : (
              <></>
            )}

            {/* <View
              style={{
                paddingVertical: normalize(15),
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: normalize(16),
                  color: colors.fontBlack,
                }}>
                โดรนฉีดพ่นของคุณ
              </Text>
            </View>
            {profilestate.droneitem.map((item: any, index: number) => (
              <DroneBrandingItem
                key={index}
                dronebrand={item.drone.series}
                serialbrand={item.serialNo}
                status={item.status}
                image={item.drone.droneBrand.logoImagePath}
              />
            ))}
            <MainButton
              label="+ เพิ่มโดรน"
              fontColor={colors.orange}
              color={'#FFEAD1'}
              onPress={showActionSheet}
            /> */}
            <View style={styles.rowContainer}>
              <View style={styles.boxCard}>
                <SwitchReceiveTask />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DroneListScreen');
                }}
                style={styles.boxCard}>
                <DronerList />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                mixpanel.track('ProfileScreen_Income_Press', {
                  to: 'IncomeScreen',
                });
                navigation.navigate('IncomeScreen');
              }}
              style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={icons.wallet} style={styles.listTileIcon} />
                <Text style={styles.listTileTitle}>รายได้</Text>
              </View>
              <Text style={styles.revenue}>{`฿${numberWithCommas(
                profilestate.totalRevenue,
              )}`}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                mixpanel.track('ProfileScreen_AdditionDocument_Press', {
                  to: 'AdditionDocumentScreen',
                });
                navigation.navigate('AdditionDocumentScreen');
              }}>
              <View style={[styles.listTile, {alignItems: 'flex-start'}]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}>
                  <Image source={icons.doc} style={styles.listTileIcon} />
                  <View>
                    <Text style={styles.listTileTitle}>ส่งเอกสารเพิ่มเติม</Text>
                    <Text
                      style={[
                        styles.listTileTitle,
                        {
                          fontFamily: font.regular,
                          fontSize: 12,
                          color: colors.gray,
                        },
                      ]}>
                      เพิ่มเอกสารเพื่อรับของรางวัล
                    </Text>
                    <Text
                      style={[
                        styles.listTileTitle,
                        {
                          fontFamily: font.regular,
                          fontSize: 12,
                          color: colors.gray,
                        },
                      ]}>
                      และสิทธิประโยชน์พิเศษจากบริษัท
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {!isDoneAuth && (
                    <Image
                      source={icons.warningFillError}
                      style={{
                        width: responsiveWidth(24),
                        height: responsiveHeigth(24),
                        marginRight: 16,
                      }}
                    />
                  )}
                  <Image
                    source={icons.arrowRight}
                    style={styles.listTileIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                mixpanel.track('ProfileScreen_NotificationList_Press');
                RootNavigation.navigate('Main', {
                  screen: 'NotificationList',
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.notification}
                    style={styles.listTileIcon}
                  />
                  <Text style={styles.listTileTitle}>การแจ้งเตือน</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {countNoti !== 0 ? (
                    <View
                      style={{
                        width: responsiveWidth(39),
                        height: responsiveHeigth(24),
                        borderRadius: responsiveHeigth(12),
                        backgroundColor: '#EB5757',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(10),
                      }}>
                      <Text
                        style={{
                          fontFamily: font.medium,
                          fontSize: normalize(12),
                          color: colors.white,
                        }}>
                        {countNoti > 99 ? '99+' : countNoti}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  <Image
                    source={icons.arrowRight}
                    style={styles.listTileIcon}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                mixpanel.track('ProfileScreen_ServiceArea_Press');
                if (Platform.OS === 'ios') {
                  await Geolocation.requestAuthorization('always');
                } else if (Platform.OS === 'android') {
                  await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  );
                }
                const dronerId = await AsyncStorage.getItem('droner_id');
                ProfileDatasource.getProfile(dronerId!).then(res => {
                  if (!res.dronerArea.districtId) {
                    navigation.navigate('ServiceArea', {
                      area: '',
                      lat: res.dronerArea.lat,
                      long: res.dronerArea.long,
                      provinceId: 0,
                      districtId: 0,
                      subdistrictId: 0,
                    });
                  } else {
                    QueryLocation.QueryProfileSubDistrict(
                      res.dronerArea.districtId,
                    ).then(result => {
                      let item = result.filter(
                        (item: any) =>
                          item.subdistrictId === res.dronerArea.subdistrictId,
                      );
                      navigation.navigate('ServiceArea', {
                        area: `${item[0].subdistrictName}/${item[0].districtName}/${item[0].provinceName}`,
                        lat: res.dronerArea.lat,
                        long: res.dronerArea.long,
                        provinceId: res.dronerArea.provinceId,
                        districtId: res.dronerArea.districtId,
                        subdistrictId: res.dronerArea.subdistrictId,
                        locationName: res.dronerArea.locationName,
                      });
                    });
                  }
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={icons.service} style={styles.listTileIcon} />
                  <Text style={styles.listTileTitle}>พื้นที่ให้บริการ</Text>
                </View>
                <Image source={icons.arrowRight} style={styles.listTileIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('ProfileScreen_DeleteAccount_Press');
                navigation.navigate('DeleteProfileScreen', {
                  tele: profilestate.id,
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.deleteUser}
                    style={styles.listTileIcon}
                  />
                  <Text style={styles.listTileTitle}>ลบบัญชี</Text>
                </View>

                <Image source={icons.arrowRight} style={styles.listTileIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await onLogout();
                RootNavigation.navigate('Auth', {
                  screen: 'HomeScreen',
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={icons.logout} style={styles.listTileIcon} />
                  <Text style={styles.listTileTitle}>ออกจากระบบ</Text>
                </View>
                <Image source={icons.arrowRight} style={styles.listTileIcon} />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 40,
              }}
            />
          </ScrollView>
        </View>
      </NetworkLost>

      <Spinner
        visible={loadingProfile}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  appBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(56),
  },
  appBarBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
    height: normalize(56),
  },
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  body: {
    flex: 1,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(16),
    color: colors.fontBlack,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    color: colors.fontBlack,
    width: '100%',
  },
  profileDescription: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: colors.fontBlack,
    flex: 1,
  },
  profileName: {
    padding: normalize(10),
    color: colors.fontBlack,
  },
  review: {
    width: normalize(54),
    height: normalize(24),
    borderRadius: normalize(14),
    backgroundColor: colors.fontBlack,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: normalize(10),
  },
  listTile: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalize(0.5),
    borderBottomColor: colors.disable,
  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
  },
  listTileTitle: {
    fontFamily: font.medium,
    paddingLeft: normalize(15),
    fontSize: normalize(15),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
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
  },

  revenue: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: '#2EC66E',
    paddingEnd: normalize(8),
  },
  commentBg: {
    backgroundColor: '#FFF7F4',
    borderColor: '#FEE9E1',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  commentFront: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    color: '#242D35',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  boxCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.disable,
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
