import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {colors, image} from '../../assets';
import fonts from '../../assets/fonts';
import {momentExtend} from '../../function/utility';
import Text from '../../components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import {RedemptionTransaction} from '../../types/MyRewardType';

import RenderHTML from '../../components/RenderHTML/RenderHTML';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
const mappingStatusText = {
  REQUEST: 'พร้อมใช้',
  PREPARE: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DONE: 'ส่งแล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  PREPARE: colors.orange,
  USED: colors.green,
  DONE: colors.green,
  EXPIRED: colors.gray,
  CANCEL: colors.decreasePoint,
};
export default function ReadyToUseTab({navigation}: {navigation: any}) {
  const take = 10;
  const [total, setTotal] = React.useState<number>(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState<RedemptionTransaction[]>([]);
  const getHistoryRewardReadyToUse = useCallback(async () => {
    try {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getHistoryReadyToUseRedeem({
        dronerId: dronerId || '',
        page: 1,
        take,
      });
      setTotal(result.count);
      setData(result.data);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    getHistoryRewardReadyToUse();
    LogBox.ignoreLogs([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNavigation = async (item: RedemptionTransaction) => {
    try {
      const result = await rewardDatasource.getRedeemDetail(
        item.dronerTransactionsId,
      );
      navigation.navigate('RedeemScreen', {
        imagePath: item.imagePath,
        data: {
          dronerTransaction: {
            ...result,
          },
        },
        expiredUsedDate: result.reward.expiredUsedDate,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHistoryRewardReadyToUse();
    setRefreshing(false);
  }, [getHistoryRewardReadyToUse]);
  const onLoadMore = useCallback(async () => {
    if (data.length < total) {
      try {
        const dronerId = await AsyncStorage.getItem('droner_id');
        const result = await rewardDatasource.getHistoryReadyToUseRedeem({
          dronerId: dronerId || '',
          page: Math.ceil(data.length / take) + 1,
          take,
        });
        setData(prev => [...prev, ...result.data]);
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [total, data.length]);
  return (
    <NetworkLost onPress={onRefresh}>
      <FlatList
        onEndReached={onLoadMore}
        style={{
          marginTop: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        data={data}
        renderItem={({item}) => {
          const isMission = item.rewardExchange !== 'SCORE';
          const statusRedeem = item.redeemDetail.redeemStatus;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onNavigation(item)}>
              <ProgressiveImage
                source={{
                  uri: item.imagePath,
                }}
                style={{
                  borderRadius: 10,
                  width: 76,
                  height: 76,
                  marginRight: 16,
                }}
              />
              <View
                style={{
                  width: '75%',
                }}>
                <RenderHTML
                  source={{html: item.rewardName}}
                  contentWidth={500}
                  tagsStyles={{
                    body: {
                      fontSize: 16,
                      fontFamily: fonts.medium,
                    },
                  }}
                />
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontFamily: fonts.regular,
                  }}>
                  {`แลกเมื่อ ${momentExtend.toBuddhistYear(
                    item.redeemDate,
                    'DD MMM YYYY HH:mm',
                  )}`}
                </Text>
                <View
                  style={{
                    marginTop: 4,

                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        marginRight: 4,
                        backgroundColor:
                          mappingStatusColor[
                            statusRedeem as keyof typeof mappingStatusColor
                          ],
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        color: colors.gray,
                      }}>
                      {
                        mappingStatusText[
                          statusRedeem as keyof typeof mappingStatusText
                        ]
                      }
                    </Text>
                  </View>
                  {isMission && (
                    <View
                      style={{
                        borderRadius: 10,
                        backgroundColor: '#FBCC96',
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.semiBold,
                          color: '#993A03',
                        }}>
                        ภารกิจ
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View
            style={{
              height: 60,
            }}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Dimensions.get('window').height - 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={image.emptyReward}
              style={{
                width: 155,
                height: 130,
                marginBottom: 16,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 16,
                color: colors.gray,
              }}>
              ไม่มีรีวอร์ด
            </Text>
          </View>
        }
      />
    </NetworkLost>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.disable,
  },
});
