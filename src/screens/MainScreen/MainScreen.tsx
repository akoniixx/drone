import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import TaskTapNavigator from '../../navigations/topTabs/TaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import icons from '../../assets/icons/icons';
import {SheetManager} from 'react-native-actions-sheet';
import {numberWithCommas, socket} from '../../function/utility';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import RegisterNotification from '../../components/Modal/RegisterNotification';
import Toast from 'react-native-toast-message';
import {mixpanel, mixpanel_token} from '../../../mixpanel';
import {GuruKaset} from '../../datasource/GuruDatasource';
import LinearGradient from 'react-native-linear-gradient';
import {usePoint} from '../../contexts/PointContext';

import {Campaign} from '../../datasource/CampaignDatasource';
import GuruKasetCarousel from '../../components/GuruKasetCarousel/GuruKasetCarousel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import {useNetwork} from '../../contexts/NetworkContext';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text';
import {useAuth} from '../../contexts/AuthContext';
import {useHighlight} from '../../contexts/HighlightContext';
import MenuList from './MainScreenComponent/MenuList';

const MainScreen: React.FC<any> = ({navigation}) => {
  const {isConnected} = useNetwork();
  const {onShow, highlightModal} = useHighlight();
  const socketSheetRef = React.useRef(false);
  const {
    state: {user},
  } = useAuth();

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
      getCurrentPoint();
      getProfile();
    }, []),
  );

  useEffect(() => {
    findAllNews();
  }, []);
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNews({
      status: 'ACTIVE',
      application: 'DRONER',
      categoryNews: 'NEWS',
      limit: 5,
      offset: 0,
      pageType: 'MAIN',
    })
      .then(res => {
        setGuruKaset(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImage();
    getProfile();
    getCurrentPoint();
    if (highlightModal.isActive) {
      onShow();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const openSocket = async () => {
      !socket.connected && socket.connect();
      socket.on(`send-task-${user?.id}`, async ({data, image_profile_url}) => {
        if (socketSheetRef.current) {
          return;
        }
        socketSheetRef.current = true;
        try {
          await SheetManager.show('NewTaskSheet', {
            payload: {
              data,
              dronerId: user?.id,
              image_profile_url,
              onHide: () => {
                socketSheetRef.current = false;
              },
            },
          });
        } catch (err) {
          console.log(err);
        } finally {
          socketSheetRef.current = false;
        }
      });
    };
    if (user?.id) {
      openSocket();
    }
  }, [user?.id]);

  const fetchImage = async () => {
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
      .catch(err => console.error(err));
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

      <View
        style={[
          stylesCentral.container,
          {paddingTop: insets.top, backgroundColor: colors.orange},
        ]}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View>
            <View style={styles.headCard}>
              <View>
                {loading ? (
                  // <View
                  //   style={{
                  //     flexDirection: 'row',
                  //     alignItems: 'center',
                  //   }}>
                  //   <Text
                  //     style={{
                  //       fontFamily: font.bold,
                  //       fontSize: normalize(24),
                  //       color: colors.fontBlack,
                  //     }}>
                  //     สวัสดี,
                  //   </Text>
                  //   <SkeletonPlaceholder
                  //     speed={2000}
                  //     borderRadius={10}
                  //     backgroundColor={colors.skeleton}>
                  //     <SkeletonPlaceholder.Item
                  //       width={100}
                  //       height={24}
                  //       borderRadius={4}
                  //       marginLeft={10}
                  //     />
                  //   </SkeletonPlaceholder>
                  // </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <SkeletonPlaceholder
                      speed={2000}
                      borderRadius={10}
                      backgroundColor={colors.skeleton}>
                      <SkeletonPlaceholder.Item flexDirection="row">
                        <SkeletonPlaceholder.Item
                          borderRadius={16}
                          width={32}
                          height={32}
                        />
                        <SkeletonPlaceholder.Item
                          width={100}
                          height={24}
                          borderRadius={4}
                          marginLeft={10}
                        />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <ProgressiveImage
                      source={{
                        uri: profile.image,
                      }}
                      resizeMode="cover"
                      style={{
                        width: normalize(32),
                        height: normalize(32),
                        borderRadius: normalize(16),
                        marginRight: normalize(10),
                        minWidth: normalize(32),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: font.bold,
                        fontSize: normalize(20),
                        color: colors.white,
                      }}>
                      {profile.name}
                    </Text>
                  </View>
                )}
                {/* <View style={styles.activeContainer}>
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
                </View> */}
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.buttonNoti}
                  onPress={() => {
                    mixpanel.track('MainScreen_NotificationList_Press');
                    navigation.navigate('NotificationList');
                  }}>
                  <Image
                    source={icons.notification}
                    style={styles.notification}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    mixpanel.track('MainScreen_ButtonPointHistory_Press', {
                      screen: 'MainScreen',
                      to: 'PointHistoryScreen',
                      currentPoint: currentPoint,
                    });
                    navigation.navigate('PointHistoryScreen');
                  }}>
                  <LinearGradient
                    colors={['#fff', '#fff']}
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
                        color: colors.orange,
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
            <MenuList navigation={navigation} />
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 16,
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
                  mixpanel.track('MainScreen_ButtonSeeAllGuruKaset_Press', {
                    screen: 'MainScreen',
                    to: 'NewsScreen',
                  });
                  navigation.navigate('NewsScreen');
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
            </View> */}
            {guruKaset !== undefined ? (
              <GuruKasetCarousel
                loading={loading}
                guruKaset={guruKaset}
                navigation={navigation}
              />
            ) : null}
          </View>
          <TaskTapNavigator
            isOpenReceiveTask={profile.isOpenReceiveTask}
            dronerStatus={profile.status}
            navigation={navigation}
          />
        </View>
      </View>

      {isConnected && campaignImage && (
        <View
          style={{
            display: showCampaign,
            position: 'absolute',
            bottom: 20,
            right: 18,
            zIndex: 1,
          }}>
          <View style={{width: 10}}>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('MainScreen_CloseCampaign_Press', {
                  hide: true,
                });
                setShowCampaign('none');
              }}>
              <Image
                source={icons.closeBlack}
                style={{width: 10, height: 10}}
              />
            </TouchableOpacity>
          </View>

          {campaignImage && (
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('MainScreen_Campaign_Press', {
                  to: 'CampaignScreen',
                });
                navigation.navigate('CampaignScreen');
              }}>
              <ProgressiveImage
                borderRadius={8}
                source={{
                  uri: campaignImage,
                }}
                resizeMode="cover"
                style={{width: 100, height: 60, borderRadius: 8}}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </BottomSheetModalProvider>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  headCard: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingHorizontal: 16,
    // paddingTop: normalize(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: normalize(5),
    backgroundColor: colors.orange,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notification: {
    width: normalize(20),
    height: normalize(20),
  },
  buttonNoti: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(20),
    marginRight: normalize(6),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
