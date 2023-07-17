import {Switch} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import TaskTapNavigator from '../../navigations/topTabs/TaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import icons from '../../assets/icons/icons';
import {SheetManager} from 'react-native-actions-sheet';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {numberWithCommas, socket} from '../../function/utility';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import RegisterNotification from '../../components/Modal/RegisterNotification';
import Toast from 'react-native-toast-message';
import fonts from '../../assets/fonts';
import {mixpanel, mixpanel_token} from '../../../mixpanel';
import {GuruKaset} from '../../datasource/GuruDatasource';
import LinearGradient from 'react-native-linear-gradient';
import {usePoint} from '../../contexts/PointContext';

import {Campaign} from '../../datasource/CampaignDatasource';
import GuruKasetCarousel from '../../components/GuruKasetCarousel/GuruKasetCarousel';

const MainScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    name: '',
    lastname: '',
    image: '',
    totalRevenue: '0',
    totalRevenueToday: '0',
    totalArea: '0',
    totalTask: '0',
    ratingAvg: '0.00',
    isOpenReceiveTask: false,
    status: '',
  });
  const {getCurrentPoint, currentPoint} = usePoint();
  const [openNoti, setOpenNoti] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [campaignImage, setCampaignImage] = useState<string>('');
  const [showCampaign, setShowCampaign] = useState<'flex' | 'none'>('flex');
  const [guruKaset, setGuruKaset] = useState<any>();

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      openSocket();
      getCurrentPoint();
    }, []),
  );

  useEffect(() => {
    findAllNews();
  }, [isFocused]);
  const findAllNews = async () => {
    setLoading(true);

    GuruKaset.findAllNews({
      status: 'ACTIVE',
      application: 'DRONER',
      categoryNews: 'NEWS',
      sortField: 'created_at',
      sortDirection: 'DESC',
      limit: 5,
      offset: 0,
      pageType: 'MAIN',
    })
      .then(res => {
        console.log(JSON.stringify(res, null, 2));
        setGuruKaset(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fecthImage();
    getProfile();
    openSocket();
    getCurrentPoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openSocket = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    await socket.connect();
    socket.on(`send-task-${dronerId!}`, ({data, image_profile_url}) => {
      //Modal Task Screen
      SheetManager.show('NewTaskSheet', {
        payload: {
          data,
          dronerId,
          image_profile_url,
        },
      });
    });
  };

  const fecthImage = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    await Campaign.getImage('DRONER', 'QUATA', 'ACTIVE')
      .then(res => {
        setLoading(true);
        setCampaignImage(res.data[0].pathImageFloating);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const getProfile = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.getProfile(droner_id!)
      .then(res => {
        sendProfilesToMixpanel(res);
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        if (imgPath.length != 0) {
          ProfileDatasource.getTaskrevenuedroner()
            .then(resRev => {
              ProfileDatasource.getImgePath(droner_id!, imgPath[0].path)
                .then(resImg => {
                  setProfile({
                    ...profile,
                    name: res.firstname,
                    image: resImg.url,
                    totalRevenue: resRev.totalRevenue,
                    totalRevenueToday: resRev.totalRevenueToday,
                    totalArea: resRev.totalArea,
                    totalTask: resRev.totalTask,
                    ratingAvg: !resRev.ratingAvg
                      ? '0.0'
                      : parseFloat(resRev.ratingAvg).toFixed(1).toString(),
                    isOpenReceiveTask: res.isOpenReceiveTask,
                    status: res.status,
                  });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        } else {
          ProfileDatasource.getTaskrevenuedroner()
            .then(resRev => {
              setProfile({
                ...profile,
                name: res.firstname,
                totalRevenue: resRev.totalRevenue,
                totalRevenueToday: resRev.totalRevenueToday,
                totalArea: resRev.totalArea,
                totalTask: resRev.totalTask,
                ratingAvg: !resRev.ratingAvg
                  ? '0.0'
                  : parseFloat(resRev.ratingAvg).toFixed(1).toString(),
                isOpenReceiveTask: res.isOpenReceiveTask,
                status: res.status,
              });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  const sendProfilesToMixpanel = async (profiles: any) => {
    const options = {
      method: 'POST',
      headers: {accept: 'text/plain', 'content-type': 'application/json'},
      body: JSON.stringify([
        {
          $token: mixpanel_token,
          $distinct_id: await mixpanel.getDistinctId(),
          $set: profiles,
        },
      ]),
    };

    fetch('https://api.mixpanel.com/engage#profile-set', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };

  const openReceiveTask = async (isOpen: boolean) => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    TaskDatasource.openReceiveTask(dronerId!, isOpen)
      .then(res => {
        setProfile({...profile, isOpenReceiveTask: res.isOpenReceiveTask});
        if (!isOpen) {
          TaskDatasource.getTaskById(
            dronerId!,
            ['WAIT_START', 'IN_PROGRESS'],
            1,
            999,
          )
            .then((res: any) => {
              if (res.length != 0) {
                Toast.show({
                  type: 'taskWarningBeforeClose',
                  onPress: () => {
                    Toast.hide();
                  },
                });
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <BottomSheetModalProvider>
      <RegisterNotification
        value={openNoti}
        onClick={() => {
          setOpenNoti(false);
          navigation.navigate('ProfileScreen', {
            navbar: false,
          });
        }}
      />

      <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View>
            <View style={styles.headCard}>
              <View>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: normalize(24),
                    color: colors.fontBlack,
                  }}>
                  สวัสดี, {profile.name}
                </Text>
                <View style={styles.activeContainer}>
                  <Switch
                    trackColor={{false: '#767577', true: colors.green}}
                    thumbColor={profile.isOpenReceiveTask ? 'white' : '#f4f3f4'}
                    value={profile.isOpenReceiveTask}
                    onValueChange={value => {
                      openReceiveTask(value);
                      if (value === true) {
                        mixpanel.track('click to open recive task status');
                      } else {
                        mixpanel.track('click to close recive task status');
                      }
                    }}
                    disabled={profile.status !== 'ACTIVE'}
                  />
                  <Text style={styles.activeFont}>เปิดรับงาน</Text>
                </View>
              </View>

              {/*  <View>
              <TouchableOpacity
                style={{
                  width: responsiveWidth(100),
                }}
                onPress={() => navigation.navigate('HistoryRewardScreen')}>
                <LinearGradient
                  colors={['#FA7052', '#F89132']}
                  start={{x: 0, y: 0}}
                  end={{x: 0.8, y: 1}}
                  style={{
                    flexDirection: 'row',
                    borderRadius: 20,
                    alignItems: 'center',
                    padding: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      source={icons.ICKDronerPoint}
                      style={{
                        width: 32,
                        height: 32,
                        marginRight: 8,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: font.bold,
                          color: colors.white,
                          lineHeight: 30,
                        }}>
                        {numberWithCommas(currentPoint.toString(), true)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    mixpanel.track('กดดูประวัติการได้รับแต้ม/ใช้แต้ม');
                    navigation.navigate('PointHistoryScreen');
                  }}>
                  <LinearGradient
                    colors={['#FA7052', '#F89132']}
                    start={{x: 0, y: 0.5}}
                    end={{x: 1, y: 0.5}}
                    style={{
                      paddingHorizontal: normalize(4),
                      paddingVertical: normalize(4),
                      borderRadius: 30,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.point}
                      style={{
                        width: normalize(28),
                        height: normalize(28),
                        marginRight: 5,
                      }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 18,
                        fontFamily: font.bold,
                        textAlign: 'right',
                        minWidth: normalize(24),
                        paddingRight: normalize(8),
                      }}>
                      {numberWithCommas(currentPoint.toString(), true)}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/*  <View style={{height: normalize(95)}}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: colors.orange,
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical: normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image source={icons.income} style={styles.iconsTask} />
                    <Text style={styles.font}>รายได้วันนี้</Text>
                  </View>
                  <Text style={styles.font}>{`฿${numberWithCommas(
                    profile.totalRevenueToday,
                  )}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#6B7580',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical: normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image source={icons.income} style={styles.iconsTask} />
                    <Text style={styles.font}>รายได้ทั้งหมด</Text>
                  </View>
                  <Text style={styles.font}>{`฿${numberWithCommas(
                    profile.totalRevenue,
                  )}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#37ABFF',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical: normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image source={icons.farm} style={styles.iconsTask} />
                    <Text style={styles.font}>ไร่สะสม</Text>
                  </View>
                  <Text style={styles.font}>{`${profile.totalArea} ไร่`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#3EBD93',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical: normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image source={icons.dronejob} style={styles.iconsTask} />
                    <Text style={styles.font}>งานที่บินเสร็จ</Text>
                  </View>
                  <Text style={styles.font}>{`${profile.totalTask} งาน`}</Text>
                </View>
              </ScrollView>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(14),
                  color: colors.fontBlack,
                  paddingHorizontal: 20,
                }}>
                กูรูเกษตร
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AllGuruScreen');
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: normalize(14),
                    color: colors.fontBlack,

                    paddingHorizontal: 10,
                  }}>
                  ดูทั้งหมด
                </Text>
              </TouchableOpacity>
            </View>
            {guruKaset != undefined ? (
              <GuruKasetCarousel
                guruKaset={guruKaset}
                navigation={navigation}
              />
            ) : null}
          </View>

          <TaskTapNavigator
            isOpenReceiveTask={profile.isOpenReceiveTask}
            dronerStatus={profile.status}
          />
        </View>
      </View>
      <View
        style={{
          display: showCampaign,
          position: 'absolute',
          bottom: 20,
          right: 10,
          zIndex: 1,
        }}>
        <View style={{width: 10, marginLeft: 20}}>
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('กดปิดแคมเปญทอง');
              setShowCampaign('none');
            }}>
            <Image source={icons.x} style={{width: 10, height: 10}} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            mixpanel.track('กดแคมเปญทองจากหน้าแรก');
            navigation.navigate('CampaignScreen');
          }}>
          <Image
            source={{uri: campaignImage}}
            style={{width: 150, height: 60}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </BottomSheetModalProvider>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  headCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: normalize(5),
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    padding: normalize(5),
    borderRadius: normalize(12),
    marginTop: normalize(10),
  },
  activeFont: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    marginLeft: normalize(18),
    color: colors.fontBlack,
  },
  font: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.white,
  },
  iconsTask: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(5),
  },
});
