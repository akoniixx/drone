import {normalize} from '@rneui/themed';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Image, RefreshControl, View} from 'react-native';
import {colors, image} from '../../assets';
import MainTasklist from '../../components/TaskList/MainTasklist';
import {GetTaskDroner, TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {calTotalPrice} from '../../function/utility';
import {useAuth} from '../../contexts/AuthContext';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import Loading from '../../components/Loading/Loading';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text';
import {CurrentFilterType} from '../../components/Sheet/SheetFilterTask';

const initialPage = 1;
const limit = 10;
const InprogressTask: React.FC<{
  currentFilter: CurrentFilterType;
  currentIndex: number;
}> = ({currentFilter, currentIndex}) => {
  const isFetching = React.useRef(false);
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [page, setPage] = useState(initialPage);
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
      taskStatus: ['IN_PROGRESS'],
      taskStatusDelay: currentFilter.listStatus.map(
        el => el.value,
      ) as GetTaskDroner['taskStatusDelay'],
    };
    TaskDatasource.getAllTaskByFilter(payload)
      .then(res => {
        setTimeout(() => setLoading(false), 200);
        setData(res);
        setCheckResIsComplete(true);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
      .finally(() => {
        isFetching.current = false;
      });
  }, [
    currentFilter.sortByField.value,
    currentFilter.sortByField.sortDirection,
    currentFilter.listStatus,
  ]);
  useFocusEffect(
    React.useCallback(() => {
      if (currentIndex === 0) {
        getData();
      }
    }, [getData, currentIndex]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  };

  const getMoreData = async () => {
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
        taskStatus: ['IN_PROGRESS'],
        taskStatusDelay: currentFilter.listStatus.map(
          el => el.value,
        ) as GetTaskDroner['taskStatusDelay'],
      };
      await TaskDatasource.getAllTaskByFilter(payload)
        .then(res => {
          setData(prev => ({
            data: [...prev.data, ...res.data],
            count: res.count,
          }));
        })
        .finally(() => {
          isFetching.current = false;
          setPage(prev => prev + 1);
          setLoadingInfinite(false);
        });
    }
    return;
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
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
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
                keyExtractor={(element, idx) => `${element.item.id}-${idx}`}
                data={data.data}
                onEndReached={getMoreData}
                extraData={data.data}
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
                  />
                )}
              />
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
export default InprogressTask;
