import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardDetail from './CardDetail';
import Text from '../../components/Text';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'MissionDetailScreen'>;
}
const mappingStatusText = {
  WAIT_REQUEST: 'ยังไม่ได้ยืนยันที่อยู่',
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  DONE: 'ส่งแล้ว',
};
const mappingStatusColor = {
  WAIT_REQUEST: colors.decreasePoint,
  REQUEST: colors.orange,
  PREPARE: colors.orange,
  DONE: colors.green,
};

const mappingDigitalStatusText = {
  REQUEST: 'พร้อมใช้',
};
const mappingDigitalStatusColor = {
  REQUEST: colors.orange,
};

export default function MissionDetailScreen({navigation, route}: Props) {
  const {data} = route.params;

  const [currentStatus, setCurrentStatus] = React.useState<string>('');
  const [dronerTransactionId, setDronerTransactionId] =
    React.useState<string>('');

  const {isDigital, isNotProgress} = useMemo(() => {
    return {
      isDigital: data.reward.rewardType === 'DIGITAL',
      isNotProgress:
        data.reward.rewardType === 'DIGITAL' && data.status !== 'INPROGRESS',
    };
  }, [data.reward, data.status]);

  const onPress = () => {
    navigation.navigate('RedeemAddressScreen', {
      missionData: {
        missionId: data.missionId,
        missionName: data.missionName,
        rewardName: data.reward.rewardName,
        amount: 1,
        step: data.num,
        imagePath: data.reward.imagePath,
        rewardId: data.reward.id,
      },
    });
  };

  useEffect(() => {
    const getStatusRewardMission = async () => {
      try {
        const dronerId = await AsyncStorage.getItem('droner_id');
        const result = await rewardDatasource.getRewardStatus({
          missionId: data.missionId,
          rewardId: data.reward.id,
          dronerId: dronerId || '',
        });

        if (result) {
          setCurrentStatus(result.status);
          setDronerTransactionId(result.dronerTransactionId);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getStatusRewardMission();
  }, [data.missionId, data.reward.id]);

  const isWaitRequest = useMemo(() => {
    if (!data.isStatusComplete && data.isComplete) {
      return true;
    }
  }, [data.isStatusComplete, data.isComplete]);
  const isShowBox = useMemo(() => {
    if (
      currentStatus &&
      currentStatus !== 'WAIT_REQUEST' &&
      data.isComplete &&
      !data.isStatusComplete
    ) {
      return true;
    }
  }, [currentStatus, data.isComplete, data.isStatusComplete]);

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        showBackBtn
        title={'รายละเอียดภารกิจ'}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View
            style={{
              flex: 1,
            }}>
            <CardDetail
              cardData={data.reward}
              current={data.current}
              dateEnd={data.endDate}
              total={data.total}
              missionName={data.missionName}
              disabled={data.isExpired}
              imagePath={data.reward.imagePath}
            />

            {/* <TouchableOpacity
              onPress={() => {
                if (isDigital && data.status === 'WAIT_REQUEST') {
                  navigation.navigate('RedeemDetailDigitalScreen', {
                    isFromHistory: false,
                    id: dronerTransactionId,
                  });
                } else {
                  navigation.navigate('MyRewardScreen', {
                    tab: 'history',
                  });
                }
              }}
              style={{
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.orange,
                borderRadius: 8,
                backgroundColor: colors.lightOrange,
              }}>
              <Text
                style={{
                  fontFamily: font.semiBold,
                  fontSize: 14,
                }}>
                สถานะ :{' '}
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 14,

                    color:
                      mappingStatusColor[
                        currentStatus as keyof typeof mappingStatusColor
                      ],
                  }}>
                  {
                    mappingStatusText[
                      currentStatus as keyof typeof mappingStatusText
                    ]
                  }
                </Text>
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                  }}>
                  {'ดูรีวิอร์ดของฉัน >'}
                </Text>
              </View>
            </TouchableOpacity> */}

            {isShowBox && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('RedeemDetailScreen', {
                    id: dronerTransactionId,
                    isFromMissionDetail: true,
                  })
                }
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.orange,
                  borderRadius: 8,
                  backgroundColor: colors.lightOrange,
                }}>
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 14,
                  }}>
                  สถานะ :{' '}
                  <Text
                    style={{
                      fontFamily: font.semiBold,
                      fontSize: 14,

                      color:
                        mappingStatusColor[
                          currentStatus as keyof typeof mappingStatusColor
                        ],
                    }}>
                    {
                      mappingStatusText[
                        currentStatus as keyof typeof mappingStatusText
                      ]
                    }
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                    }}>
                    {'ดูรีวิอร์ดของฉัน >'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {isWaitRequest && (
              <View
                style={{
                  marginVertical: 8,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 16,
                    color: colors.decreasePoint,
                  }}>
                  กรุณายืนยืนที่อยู่จัดส่ง เพื่อรับของรางวัล
                </Text>
              </View>
            )}

            <View
              style={{
                marginTop: 8,
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: colors.fontBlack,
                }}>
                รายละเอียด
              </Text>
              <Text
                style={{
                  fontFamily: font.light,
                  color: colors.gray,
                }}>
                {data.descriptionReward}
              </Text>
            </View>
            <View
              style={{
                marginTop: 8,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: colors.fontBlack,
                }}>
                เงื่อนไข
              </Text>
              <Text
                style={{
                  fontFamily: font.light,
                  color: colors.gray,
                }}>
                {data.conditionReward}
              </Text>
            </View>
          </View>
          {isWaitRequest && (
            <View
              style={{
                padding: 16,
              }}>
              <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.textButton}>ยืนยันการแลก</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  footer: {
    height: 100,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
