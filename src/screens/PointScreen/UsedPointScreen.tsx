import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {getAllHistoryPoint} from '../../datasource/HistoryPointDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import {HistoryPoint} from '../../components/point/HistoryPoint';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import Text from '../../components/Text';

const UsedPointScreen: React.FC<any> = () => {
  const [dataAllPoint, setDataAllPoint] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [row] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    getHistoryPoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getHistoryPoint = async () => {
    setLoading(true);
    const droner_id: any = await AsyncStorage.getItem('droner_id');
    await getAllHistoryPoint(droner_id, 1, row)
      .then(res => {
        setTotal(res.count);
        setDataAllPoint(res.history);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getHistoryPoint();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreData = async () => {
    if (dataAllPoint.length >= total) {
      return;
    }
    try {
      setLoading(true);
      const droner_id: any = await AsyncStorage.getItem('droner_id');
      await getAllHistoryPoint(droner_id, current + 1, row)
        .then(res => {
          setDataAllPoint([...dataAllPoint, ...res.history]);
          setLoading(false);
        })
        .catch(err => console.log(err));
      setCurrent(current + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <NetworkLost
        onPress={onRefresh}
        height={Dimensions.get('window').height - 300}>
        {dataAllPoint ? (
          <View
            style={{
              backgroundColor: colors.white,
            }}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={loadMoreData}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View
                  style={{
                    alignSelf: 'center',
                    paddingVertical: normalize(150),
                    height: '100%',
                  }}>
                  <Image
                    source={image.pointEmpty}
                    style={{width: normalize(130), height: normalize(120)}}
                  />
                  <View style={{top: normalize(20)}}>
                    <Text style={styles.textEmpty}>ไม่มีคะแนนที่ได้รับ</Text>
                    <Text style={styles.textEmpty}>และการที่ใช้คะแนน</Text>
                  </View>
                </View>
              }
              data={dataAllPoint}
              renderItem={({item, index}) => {
                return (
                  <HistoryPoint
                    {...item}
                    index={index}
                    date={item.createAt}
                    point={item.amountValue}
                    action={item.action}
                    campaignName={item.campaignName}
                    taskId={item.taskId}
                    isSpecialPointDroner={item.isSpecialPointDroner}
                    taskNo={item.taskNo != null ? item.taskNo : ''}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{
              alignSelf: 'center',
              paddingVertical: normalize(150),
              height: '100%',
            }}>
            <Image
              source={image.pointEmpty}
              style={{width: normalize(130), height: normalize(120)}}
            />
            <View style={{top: normalize(20)}}>
              <Text style={styles.textEmpty}>ไม่มีคะแนนที่ได้รับ</Text>
              <Text style={styles.textEmpty}>และการที่ใช้คะแนน</Text>
            </View>
          </View>
        )}
      </NetworkLost>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </View>
  );
};
export default UsedPointScreen;

const styles = StyleSheet.create({
  inner: {
    marginTop: normalize(50),
    paddingHorizontal: normalize(17),
  },
  container: {
    flex: 1,
  },
  HeadBg: {
    width: '100%',
    height: normalize(140),
    backgroundColor: colors.green,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
  },
  textEmpty: {
    fontFamily: font.regular,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    textAlign: 'center',
    color: colors.fontGrey,
  },
});
