import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import {colors, font} from '../../assets';
import {numberWithCommas} from '../../function/utility';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import RenderHTML from '../../components/RenderHTML/RenderHTML';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import NetworkLost from '../../components/NetworkLost/NetworkLost';

export interface RewardListType {
  id: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: string | null;
  amount: number;
  used: number;
  remain: number;
  description: string;
  condition: string;
  startExchangeDate: string;
  expiredExchangeDate: string;
  startUsedDate: string | null;
  expiredUsedDate: string | null;
  startExchangeDateCronJob: string | null;
  expiredExchangeDateCronJob: string;
  startUsedDateCronJob: string | null;
  expiredUsedDateCronJob: string | null;
  digitalCode: string | null;
  status: string;
  statusUsed: string | null;
  createAt: string;
  updateAt: string;
}
export default function ListReward({
  navigation,
  setLoading,
}: {
  navigation: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [listReward, setListReward] = useState<{
    count: number;
    data: RewardListType[];
  }>({
    count: 0,
    data: [],
  });
  const take = 10;
  const widthImg = Dimensions.get('window').width / 2 - 32;
  const [refreshing, setRefreshing] = useState(false);
  const getFirstListReward = useCallback(async () => {
    try {
      setLoading(true);
      const result = await rewardDatasource.getListRewards({
        page: 1,
        take,
      });
      setListReward(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, take]);
  useEffect(() => {
    getFirstListReward();
  }, [getFirstListReward]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getFirstListReward().finally(() => setRefreshing(false));
  }, [getFirstListReward]);

  const loadMore = async () => {
    if (listReward.data.length >= listReward.count) {
      return;
    } else {
      try {
        setLoading(true);
        const result = await rewardDatasource.getListRewards({
          page: Math.ceil(listReward.data.length / take) + 1,
          take,
        });
        setListReward({
          count: result.count,
          data: [...listReward.data, ...result.data],
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const renderItem = useMemo(() => {
    return ({item}: {item: RewardListType; index: number}) => {
      const dateDiff = moment(item.expiredUsedDate).fromNow();
      const isExpired =
        item.expiredUsedDate && moment(item.expiredUsedDate).isAfter(moment());
      return (
        <>
          <TouchableOpacity
            style={[styles.card]}
            onPress={() => {
              mixpanel.track('RewardScreen_RewardCard_Press', {
                ...item,
                rewardId: item.id,
              });
              navigation.navigate('RewardDetailScreen', {
                id: item.id,
                isDigital: item.rewardType === 'DIGITAL',
              });
            }}>
            <ProgressiveImage
              style={{
                width: widthImg,
                height: widthImg,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
              source={{uri: item.imagePath}}
            />
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 8,
              }}>
              <RenderHTML
                source={{html: item.rewardName}}
                contentWidth={Dimensions.get('window').width / 2}
                tagsStyles={{
                  body: {
                    fontFamily: font.semiBold,
                    fontSize: 18,
                    color: colors.fontBlack,
                  },
                }}
              />
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 14,
                  paddingVertical: 4,
                  color: colors.fontBlack,
                }}>
                {numberWithCommas((item.score || 0).toString(), true)}{' '}
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    color: colors.fontBlack,
                  }}>
                  แต้ม
                </Text>
              </Text>
              {isExpired && (
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                  }}>
                  หมดอายุอีก {dateDiff}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </>
      );
    };
  }, [navigation, widthImg]);
  return (
    <NetworkLost
      onPress={onRefresh}
      style={{
        marginTop: 16,
      }}
      height={Dimensions.get('window').height - 300}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{marginTop: 16}}
        data={listReward?.data || []}
        renderItem={renderItem}
        numColumns={2}
        onEndReached={loadMore}
        ListFooterComponent={
          <View
            style={{
              height: 180,
            }}
          />
        }
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </NetworkLost>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDFE3',
    flexGrow: 1,
    margin: 6,
    flex: 0.48,
    maxWidth: Dimensions.get('window').width / 2 - 32,
  },
  itemSeparator: {
    width: 10,
  },
});
