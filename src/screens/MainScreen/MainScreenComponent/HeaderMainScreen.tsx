import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Switch} from '@rneui/themed';
import Text from '../../../components/Text';
import {colors, font} from '../../../assets';
import {normalize} from '../../../function/Normalize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {mixpanel} from '../../../../mixpanel';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native';
import icons from '../../../assets/icons/icons';
import {numberWithCommas} from '../../../function/utility';
import {usePoint} from '../../../contexts/PointContext';
import GuruKasetCarousel from '../../../components/GuruKasetCarousel/GuruKasetCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TaskDatasource} from '../../../datasource/TaskDatasource';
import Toast from 'react-native-toast-message';
import Animated from 'react-native-reanimated';

interface Props {
  animatedHeaderStyle: any;
  loading?: boolean;
  setProfile: React.Dispatch<
    React.SetStateAction<{
      name: string;
      lastname: string;
      image: string;
      totalRevenue: string;
      totalRevenueToday: string;
      totalArea: string;
      totalTask: string;
      ratingAvg: string;
      isOpenReceiveTask: boolean;
      status: string;
    }>
  >;
  profile: {
    name: string;
    lastname: string;
    image: string;
    totalRevenue: string;
    totalRevenueToday: string;
    totalArea: string;
    totalTask: string;
    ratingAvg: string;
    isOpenReceiveTask: boolean;
    status: string;
  };
  navigation: any;
  guruKaset?: any;
}
export default function HeaderMainScreen({
  loading = false,
  setProfile,
  profile,
  navigation,
  guruKaset,
  animatedHeaderStyle,
}: Props) {
  const {currentPoint} = usePoint();
  const openReceiveTask = async (isOpen: boolean) => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    TaskDatasource.openReceiveTask(dronerId!, isOpen)
      .then(res => {
        setProfile(prev => ({
          ...prev,
          isOpenReceiveTask: res.isOpenReceiveTask,
        }));
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
    <Animated.View style={animatedHeaderStyle}>
      <View style={styles.headCard}>
        <View>
          {loading ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                }}>
                สวัสดี,
              </Text>
              <SkeletonPlaceholder
                speed={2000}
                borderRadius={10}
                backgroundColor={colors.skeleton}>
                <SkeletonPlaceholder.Item
                  width={100}
                  height={24}
                  borderRadius={4}
                  marginLeft={10}
                />
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(24),
                color: colors.fontBlack,
              }}>
              สวัสดี, {profile.name}
            </Text>
          )}
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
          ข่าวสาร
        </Text>
        <TouchableOpacity
          onPress={() => {
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
      </View>
      {guruKaset !== undefined ? (
        <GuruKasetCarousel
          loading={loading}
          guruKaset={guruKaset}
          navigation={navigation}
        />
      ) : null}
    </Animated.View>
  );
}
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
