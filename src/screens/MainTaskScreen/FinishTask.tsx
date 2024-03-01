import {normalize} from '@rneui/themed';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Image, RefreshControl, View} from 'react-native';
import {colors, image} from '../../assets';
import MainTasklist from '../../components/TaskList/MainTasklist';
import {GetTaskDroner, TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {calTotalPrice} from '../../function/utility';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import {useAuth} from '../../contexts/AuthContext';
import Loading from '../../components/Loading/Loading';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text';
import {CurrentFilterType} from '../../components/Sheet/SheetFilterTask';
const initialPage = 1;
const limit = 10;
const FinishTask: React.FC<{
  currentFilter: CurrentFilterType;
  currentIndex: number;
}> = ({currentFilter, currentIndex}) => {
  const isFetching = React.useRef(false);
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const [loadingInfinite, setLoadingInfinite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const getData = useCallback(async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    const payload: GetTaskDroner = {
      dronerId: droner_id,
      sortField: currentFilter.sortByField.value,
      sortDirection: currentFilter.sortByField.sortDirection,
      page: initialPage,
      take: limit,
      taskStatus: currentFilter.listStatus.map(
        el => el.value,
      ) as GetTaskDroner['taskStatus'],
      taskStatusPayment: currentFilter.paymentStatus.map(
        el => el.value,
      ) as GetTaskDroner['taskStatusPayment'],
    };

    TaskDatasource.getAllTaskByFilter(payload)
      .then(res => {
        setData(res);
        setCheckResIsComplete(true);
        setTimeout(() => setLoading(false), 200);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
      .finally(() => {
        isFetching.current = false;
        setLoading(false);
      });
  }, [
    currentFilter.listStatus,
    currentFilter.paymentStatus,
    currentFilter.sortByField.value,
    currentFilter.sortByField.sortDirection,
  ]);
  useFocusEffect(
    React.useCallback(() => {
      if (currentIndex === 2) {
        getData();
      }
    }, [getData, currentIndex]),
  );
  const onRefresh = async () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  };
  const onEndReached = async () => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    if (data.data.length < data.count) {
      setLoadingInfinite(true);
      const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
      const payload: GetTaskDroner = {
        dronerId: droner_id,
        sortField: currentFilter.sortByField.value,
        sortDirection: currentFilter.sortByField.sortDirection,
        page: page + 1,
        take: limit,
        taskStatus: currentFilter.listStatus.map(
          el => el.value,
        ) as GetTaskDroner['taskStatus'],
        taskStatusPayment: currentFilter.paymentStatus.map(
          el => el.value,
        ) as GetTaskDroner['taskStatusPayment'],
      };

      TaskDatasource.getAllTaskByFilter(payload)
        .then(res => {
          setData({
            data: [...data.data, ...res.data],
            count: res.count,
          });
          setPage(page + 1);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          isFetching.current = false;
          setLoadingInfinite(false);
        });
    }
  };

  const RenderWarningDoc = useMemo(() => {
    if (!isDoneAuth) {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}>
          <WarningDocumentBox />
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}
        />
      );
    }
  }, [isDoneAuth]);

  const RenderWarningDocEmpty = useMemo(() => {
    if (!isDoneAuth && data.data.length < 1) {
      return () => (
        <View
          style={{
            paddingBottom: 8,
            paddingHorizontal: 8,
            height: normalize(80),
            backgroundColor: colors.grayBg,
          }}>
          <WarningDocumentBox />
        </View>
      );
    } else {
      return () => <View />;
    }
  }, [isDoneAuth, data]);

  return (
    <NetworkLost onPress={onRefresh}>
      <RenderWarningDocEmpty />
      {loading ? (
        <View
          style={{
            padding: 16,
          }}>
          <SkeletonPlaceholder
            speed={2000}
            backgroundColor={colors.skeleton}
            borderRadius={10}>
            <>
              {Array.from(Array(3).keys()).map(_ => {
                return (
                  <SkeletonPlaceholder.Item marginBottom={12}>
                    <View
                      style={{
                        height: normalize(200),
                        borderRadius: 10,
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                );
              })}
            </>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <>
          {data.data.length !== 0 && checkResIsComplete ? (
            <View style={[{flex: 1}]}>
              <FlatList
                keyExtractor={(element, index) =>
                  `${element.item.taskNo}-${index}`
                }
                data={data.data}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={onEndReached}
                ListHeaderComponent={RenderWarningDoc}
                contentContainerStyle={{paddingHorizontal: 8}}
                ListFooterComponent={
                  loadingInfinite ? (
                    <View
                      style={{
                        padding: 16,
                      }}>
                      <Loading spinnerSize={40} />
                    </View>
                  ) : (
                    <View style={{height: 40}} />
                  )
                }
                extraData={data}
                renderItem={({item}: any) => (
                  <MainTasklist
                    {...item.item}
                    id={item.item.taskNo}
                    status={item.item.status}
                    title={item.item.farmerPlot.plantName}
                    price={calTotalPrice(
                      item.item.price,
                      item.item.revenuePromotion,
                    )}
                    date={item.item.dateAppointment}
                    address={item.item.farmerPlot.locationName}
                    distance={item.item.distance}
                    user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                    img={item.image_profile_url}
                    preparation={item.item.preparationBy}
                    tel={item.item.farmer.telephoneNo}
                    taskId={item.item.id}
                    farmArea={item.item.farmAreaAmount}
                    finishTime={item.item.taskHistory}
                  />
                )}
              />
              <View />
            </View>
          ) : (
            <View
              style={[
                stylesCentral.center,
                {flex: 1, backgroundColor: colors.grayBg, padding: 8},
              ]}>
              <Image
                source={image.blankTask}
                style={{width: normalize(136), height: normalize(111)}}
              />
              <Text style={stylesCentral.blankFont}>
                ยังไม่มีงานที่เริ่มดำเนินการ
              </Text>
            </View>
          )}
        </>
      )}
    </NetworkLost>
  );
};
export default FinishTask;
