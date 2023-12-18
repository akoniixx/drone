import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {getAllPendingPointPagination} from '../../datasource/HistoryPointDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {PendingPoint} from '../../components/point/PendingPoint';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import Text from '../../components/Text';
import icons from '../../assets/icons/icons';

const PendingPointScreen: React.FC<any> = () => {
  const [dataAllPoint, setDataAllPoint] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [row] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const getPendingPoint = useCallback(async () => {
    setLoading(true);
    const droner_id: any = await AsyncStorage.getItem('droner_id');
    await getAllPendingPointPagination({
      dronerId: droner_id,
      page: 1,
      take: row,
    })
      .then(res => {
        setDataAllPoint(res.data);
        setTotal(res.count);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getPendingPoint();
    return () => {
      setDataAllPoint([]);
      setTotal(0);
      setCurrent(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPendingPoint();
    setCurrent(1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const loadMoreData = async () => {
    if (dataAllPoint.length >= total) {
      return;
    }
    try {
      setLoading(true);
      const droner_id: any = await AsyncStorage.getItem('droner_id');
      await getAllPendingPointPagination({
        dronerId: droner_id,
        page: current + 1,
        take: row,
      })
        .then(res => {
          setDataAllPoint([...dataAllPoint, ...res.data]);
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
      <View
        style={{
          alignItems: 'center',
          paddingVertical: normalize(10),
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Image
          source={icons.warningBlack}
          style={{
            width: normalize(20),
            height: normalize(20),
            marginRight: normalize(5),
          }}
        />
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(12),
            color: colors.fontGrey,
          }}>
          แต้มโดยประมาณที่ท่านจะได้รับจากงานหรือกิจกรรม
        </Text>
      </View>
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
              ListFooterComponent={<View style={{height: normalize(450)}} />}
              data={dataAllPoint}
              renderItem={({item, index}) => (
                <PendingPoint
                  index={index}
                  date={item.createAt}
                  point={item.receivePoint}
                  action={item.campaignName}
                  taskId={item.taskId}
                  taskNo={item?.task?.taskNo}
                />
              )}
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
export default PendingPointScreen;

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
