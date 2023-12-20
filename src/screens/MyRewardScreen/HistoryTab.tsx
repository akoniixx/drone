/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  StyleSheet,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {colors, image} from '../../assets';
import fonts from '../../assets/fonts';
import {momentExtend} from '../../function/utility';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RenderHTML from '../../components/RenderHTML/RenderHTML';
import {Image} from 'react-native';
import {RedemptionTransaction} from '../../types/MyRewardType';
import Text from '../../components/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import NetworkLost from '../../components/NetworkLost/NetworkLost';

const mappingStatusText = {
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DONE: 'ส่งแล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: '#EBBB00',
  PREPARE: colors.orange,
  USED: colors.green,
  DONE: colors.green,
  EXPIRED: colors.gray,
  CANCEL: colors.decreasePoint,
};
// const mappingStatusColorText = {
//   REQUEST: colors.fontBlack,
//   DELIVERING: colors.fontBlack,
//   USED: colors.green,
//   DELIVERED: colors.green,
//   EXPIRED: colors.gray,
//   CANCEL: colors.decreasePoint,
// };

export default function HistoryTab({navigation}: {navigation: any}) {
  const take = 10;
  const [prepareData, setPrepareData] = React.useState<RedemptionTransaction[]>(
    [],
  );
  const [doneData, setDoneData] = React.useState<RedemptionTransaction[]>([]);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const getHistoryReward = useCallback(async () => {
    try {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getHistoryRedeem({
        dronerId: dronerId || '',
        page: 1,
        take,
      });
      setTotal(result.count);
      const curPrepareData: RedemptionTransaction[] = [];
      const curDoneData: RedemptionTransaction[] = [];
      (result.data || []).forEach((el: RedemptionTransaction) => {
        const isPrepare =
          el.redeemDetail.redeemStatus === 'PREPARE' ||
          el.redeemDetail.redeemStatus === 'REQUEST';
        if (isPrepare) {
          curPrepareData.push(el);
        } else {
          curDoneData.push(el);
        }
      });
      setPrepareData(curPrepareData);
      setDoneData(curDoneData);
    } catch (error) {
      console.log('error', error);
    }
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHistoryReward();
    setRefreshing(false);
  }, [getHistoryReward]);
  useEffect(() => {
    getHistoryReward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const historyData = useMemo(() => {
    const sectionData = [];

    if (prepareData.length > 0) {
      sectionData.push({
        title: 'กำลังดำเนินการ',
        data: prepareData || [],
        sectionName: 'progress',
      });
    }
    if (doneData.length > 0) {
      sectionData.push({
        title: 'เสร็จสิ้น',
        data: doneData || [],
        sectionName: 'complete',
      });
    }
    return sectionData;
  }, [prepareData, doneData]);
  const onLoadingMore = async () => {
    if (doneData.length + prepareData.length < total) {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getHistoryRedeem({
        dronerId: dronerId || '',
        page: Math.ceil((doneData.length + prepareData.length) / take) + 1,
        take,
      });
      const curPrepareData: RedemptionTransaction[] = [];
      const curDoneData: RedemptionTransaction[] = [];
      (result.data || []).forEach((el: RedemptionTransaction) => {
        const isPrepare =
          el.redeemDetail.redeemStatus === 'PREPARE' ||
          el.redeemDetail.redeemStatus === 'REQUEST';
        if (isPrepare) {
          curPrepareData.push(el);
        } else {
          curDoneData.push(el);
        }
      });
      setPrepareData([...prepareData, ...curPrepareData]);
      setDoneData([...doneData, ...curDoneData]);
    } else {
      console.log('end');
    }
  };
  const onPressItem = (id: string) => {
    // console.log(id);
    navigation.navigate('RedeemDetailScreen', {id});
  };
  const EmptyState = () => {
    return (
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
    );
  };
  return (
    <NetworkLost
      onPress={onRefresh}
      height={Dimensions.get('window').height - 300}>
      <SectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          marginTop: 16,
        }}
        onEndReached={onLoadingMore}
        ListFooterComponent={
          <View
            style={{
              height: 100,
            }}
          />
        }
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => `-${index}`}
        sections={historyData || []}
        renderSectionHeader={({section: {title}}) => {
          return (
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: colors.gray,
                marginBottom: 8,
              }}>
              {title}
            </Text>
          );
        }}
        ListEmptyComponent={EmptyState()}
        renderItem={({item}) => {
          const statusRedeem = item.redeemDetail.redeemStatus;
          const isMission = item.rewardExchange !== 'SCORE';
          const isDigital = item.rewardType === 'DIGITAL';

          return (
            <TouchableOpacity
              onPress={() => {
                isDigital
                  ? navigation.navigate('RedeemDetailDigitalScreen', {
                      id: item.dronerTransactionsId,
                    })
                  : onPressItem(item.dronerTransactionsId);
              }}
              style={styles({type: statusRedeem}).card}>
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
      />
    </NetworkLost>
  );
}
const styles = ({type}: {type: string}) => {
  const isRequest = type === 'REQUEST';
  const isPrepare = type === 'PREPARE';
  return StyleSheet.create({
    card: {
      backgroundColor: isPrepare
        ? colors.lightOrange
        : isRequest
        ? '#FFF8DC'
        : colors.white,
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: isPrepare
        ? colors.darkOrange
        : isRequest
        ? mappingStatusColor.REQUEST
        : colors.disable,
    },
  });
};
