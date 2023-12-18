import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import {CardGuru} from '../../components/Guru/CardGuru';

import {font} from '../../assets/index';
import {useIsFocused} from '@react-navigation/native';
import {GuruKaset} from '../../datasource/GuruDatasource';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {normalize} from '../../function/Normalize';
import {momentExtend} from '../../function/utility';
import {mixpanel} from '../../../mixpanel';
import {RefreshControl} from 'react-native-gesture-handler';
import GuruKasetCarousel from '../../components/GuruKasetCarousel/GuruKasetCarousel';
import Text from '../../components/Text';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
const initialLimit = 6;
const filterListSelect = [
  {
    id: 1,
    title: 'ล่าสุด',
    value: 'created_at',
    mixpanel: 'เลือกฟิลเตอร์กูรูเกษตรล่าสุด',
  },
  {
    id: 2,
    title: 'นิยมมากสุด',
    value: 'read',
    mixpanel: 'เลือกฟิลเตอร์กูรูเกษตรนิยมมากสุด',
  },
];

const NewsScreen: React.FC<any> = ({navigation}) => {
  const isFocused = useIsFocused();
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [loading, setLoading] = useState(false);
  const filterNews = useRef<any>();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [data, setData] = useState<any>({
    data: [],
    count: 0,
  });
  const [pinNews, setPinNews] = useState<any>({
    data: [],
    count: 0,
  } as any);
  const [limit, setLimit] = useState(initialLimit);

  const [refreshing, setRefreshing] = useState(false);

  const findAllNews = useCallback(async () => {
    setLoading(true);
    GuruKaset.findAllNews({
      status: 'ACTIVE',
      application: 'DRONER',
      categoryNews: 'NEWS',
      sortField: sortBy,
      sortDirection: 'DESC',
      offset: 1,
      limit: initialLimit,
      pageType: 'ALL',
    })
      .then(res => {
        if (res) {
          setData(res);
          setLimit(initialLimit);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [sortBy]);

  const getNewsPinned = useCallback(async () => {
    const result = await GuruKaset.findAllNews({
      status: 'ACTIVE',
      application: 'DRONER',
      categoryNews: 'NEWS',
      offset: 1,
      limit: 5,
      pageType: 'ALL',
    });
    if (result) {
      setPinNews(result);
    }
  }, []);

  useEffect(() => {
    getNewsPinned();
  }, []);
  useEffect(() => {
    findAllNews();
  }, [isFocused, findAllNews, sortBy]);

  const onLoadMore = async () => {
    if (data.count > data.data.length) {
      setLoading(true);
      const res = await GuruKaset.findAllNews({
        status: 'ACTIVE',
        application: 'DRONER',
        categoryNews: 'NEWS',
        sortField: sortBy,
        sortDirection: 'DESC',
        offset: 1,
        limit: limit + initialLimit,
      });
      setLimit(limit + initialLimit);
      if (res) {
        setData({
          data: [...res.data],
          count: res.count,
        });
      }
      setLoading(false);
    } else {
      console.log('no more data');
    }
  };

  const GuruKasetHeader = useMemo(() => {
    const filterNews = (pinNews?.data || []).filter((el: any) => el.pin_all);
    if (filterNews.length < 1) {
      return <View />;
    }

    return (
      <>
        <GuruKasetCarousel
          guruKaset={{
            data: filterNews,
          }}
          navigation={navigation}
          allScreen
        />
      </>
    );
  }, [pinNews, navigation]);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await findAllNews();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="ข่าวสาร"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('กดย้อนกลับจากหน้ารวมข่าวสารกูรูเกษตร');
          navigation.goBack();
        }}
        image={() => (
          <TouchableOpacity
            onPress={async () => {
              mixpanel.track('กดฟิลเตอร์ กูรูเกษตร');
              filterNews.current.show();
            }}>
            <Image source={icons.filter} style={{width: 28, height: 29}} />
          </TouchableOpacity>
        )}
      />
      <NetworkLost onPress={onRefresh}>
        <FlatList
          ListHeaderComponent={GuruKasetHeader}
          onEndReached={onLoadMore}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={data.data}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={async () => {
                  mixpanel.track('GuruKasetScreen_NewsCard_Press', {
                    newsId: item.id,
                  });
                  await AsyncStorage.setItem('guruId', `${item.id}`);
                  navigation.push('DetailGuruScreen');
                }}>
                <CardGuru
                  key={index}
                  index={item.index}
                  background={item.image_path}
                  title={item.title}
                  date={momentExtend.toBuddhistYear(
                    item.created_at,
                    'DD MMM YY',
                  )}
                  read={item.read}
                />
              </TouchableOpacity>
            );
          }}
        />
      </NetworkLost>

      <ActionSheet ref={filterNews}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(30),
            width: windowWidth,
            height: windowHeight * 0.28,
            borderRadius: normalize(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: normalize(20),
            }}>
            <Text style={{fontSize: 22, fontFamily: font.medium}}>
              เรียงลำดับบทความ
            </Text>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('กดยกเลิกฟิลเตอร์ กูรูเกษตร');
                filterNews.current.hide();
              }}>
              <Text
                style={{
                  color: colors.orange,
                  fontFamily: font.medium,
                  fontSize: normalize(16),
                }}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 0.3,
              paddingVertical: 5,
              borderColor: colors.disable,
            }}
          />
          <View style={{flex: 1}}>
            {filterListSelect.map((el, idx) => {
              const isFocus = sortBy === el.value;
              return (
                <View key={idx}>
                  <TouchableOpacity
                    onPress={async () => {
                      mixpanel.track(el.mixpanel);
                      filterNews.current.hide();
                      setSortBy(el.value);
                    }}
                    key={idx}
                    style={{
                      height: 60,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingRight: 16,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: normalize(30),
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: font.regular,
                          color: colors.fontBlack,
                        }}>
                        {el.title}
                      </Text>
                    </View>

                    {isFocus && (
                      <Image
                        source={icons.checkFillOrange}
                        style={{
                          width: 32,
                          height: 32,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomWidth: 0.3,

                      borderColor: colors.disable,
                      width: Dimensions.get('screen').width * 0.9,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ActionSheet>
      {/* <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      /> */}
    </SafeAreaView>
  );
};

export default NewsScreen;
