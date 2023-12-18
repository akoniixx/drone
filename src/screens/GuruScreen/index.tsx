import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Text from '../../components/Text';
// import Video, {OnProgressData} from 'react-native-video';
import {colors, font, icons} from '../../assets';
import GuruTapNavigator from './GuruTapNavigator';
import ItemContent from './ItemContent';
import {GuruKaset} from '../../datasource/GuruDatasource';
import {useIsFocused} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import EmptyGuru from '../../components/EmptyGuru';

interface Props {
  navigation: any;
}
// const initialListsHeader = [
//   {
//     title: 'ทั้งหมด',
//     value: 'all',
//   },
//   {
//     title: 'โรคพืช',
//     value: 'plantDisease',
//   },
//   {
//     title: 'การใช้ยา',
//     value: 'useMedicine',
//   },
//   {
//     title: 'การใช้ปุ๋ย',
//     value: 'useFertilizer',
//   },
//   {
//     title: 'การใช้สารเคมี',
//     value: 'useChemical',
//   },
// ];
const limit = 10;
export interface GuruData {
  _id: string;
  type: string;
  name: string;
  view: number;
  like: number;
  commentCount: number;
  read: number;
  application: string;
  status: string;
  grouping: string;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description: string;
  image: string;
  startDateCronJob: string | null;
  favorite: boolean;
  groupName: string;
}
interface GuruKasetData {
  data: GuruData[];
  count: 0;
}
const initialPage = 1;
export default function GuruScreen({navigation}: Props) {
  const [listsHeader, setListsHeader] = React.useState<
    {
      title: string;
      value: string;
    }[]
  >([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(initialPage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTabHeader, setCurrentTabHeader] = React.useState('all');
  const [currentTab, setCurrentTab] = React.useState('all');
  const [guruKasetData, setGuruKasetData] = React.useState<GuruKasetData>({
    data: [],
    count: 0,
  });

  const onPressBack = () => {
    navigation.goBack();
  };
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  let lastScrollY = useRef(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingUp =
      currentOffset > 0 && currentOffset > lastScrollY.current;

    Animated.timing(headerTranslateY, {
      toValue: isScrollingUp ? -100 : 0, // Adjust -100 to the height of your header
      duration: 500, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    lastScrollY.current = currentOffset;
  };

  // const videoRef = useRef<Video>(null);
  // const [progress, setProgress] = React.useState(0);
  // const handleProgress = (progress: OnProgressData) => {
  //   const percent = (progress.currentTime / progress.seekableDuration) * 100;
  //   setProgress(percent);
  // };
  // console.log('progress', progress);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const resultGroup = await GuruKaset.getGroupGuru({
          page: 1,
          take: 99,
        });
        const formatGroupGuru = (resultGroup.data || []).map((item: any) => {
          return {
            title: item.groupName,
            value: item._id,
          };
        });
        const all = {
          title: 'ทั้งหมด',
          value: 'all',
        };

        setListsHeader([all, ...formatGroupGuru]);
      } catch (e) {
        console.log(e);
      }
    };
    getInitialData();
  }, []);

  const getListGuru = async () => {
    try {
      setLoading(true);
      const result = await GuruKaset.getAllGuru({
        page: 1,
        limit: limit,
        groupId: currentTabHeader === 'all' ? undefined : currentTabHeader,
      });
      setGuruKasetData(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListGuru();
  }, [currentTabHeader, isFocused]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      getListGuru();
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };
  const onLoadMore = async () => {
    if (guruKasetData.data.length >= guruKasetData.count) {
      console.log('no more data');
      return;
    }
    try {
      const result = await GuruKaset.getAllGuru({
        page: page + 1,
        limit: limit,
        groupId: currentTabHeader === 'all' ? undefined : currentTabHeader,
      });
      setGuruKasetData({
        data: [...guruKasetData.data, ...result.data],
        count: result.count,
      });
      setPage(page + 1);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{paddingTop: 14, paddingHorizontal: 24}}
            onPress={onPressBack}>
            <Image
              source={icons.arrowLeft}
              style={{
                width: 28,
                height: 28,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              paddingTop: 14,
              flexDirection: 'row',
              width: '100%',
              marginLeft: Dimensions.get('window').width / 2 - 140,
            }}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 20,
              }}>
              บทความทั้งหมด
            </Text>
          </View>
          {/* <GuruTapNavigator
            onChange={(value: string) => {
              setCurrentTab(value);
            }}
            value={currentTab}
          /> */}
        </View>
        <MemoHeaderFlatList
          lists={listsHeader}
          value={currentTabHeader}
          onChange={(value: string) => {
            setCurrentTabHeader(value);
            setPage(initialPage);
          }}
        />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEnabled={guruKasetData?.data?.length > 0}
          ListEmptyComponent={<EmptyGuru />}
          scrollEventThrottle={64}
          onEndReached={onLoadMore}
          onScroll={handleScroll}
          data={
            loading
              ? ([
                  {
                    _id: '1',
                  },
                  {
                    _id: '2',
                  },
                ] as GuruData[])
              : guruKasetData.data || []
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          keyExtractor={(item, index) => `${item?._id}-${index}`}
          // ListHeaderComponent={() => {
          //   return (
          //     <Animated.View
          //       style={{
          //         transform: [{translateY: headerTranslateY}],
          //       }}></Animated.View>
          //   );
          // }}
          renderItem={({item, index}) => {
            if (loading) {
              return (
                <View style={{height: 450}}>
                  <SkeletonPlaceholder
                    backgroundColor={colors.skeleton}
                    speed={2000}
                    borderRadius={10}>
                    <>
                      <SkeletonPlaceholder.Item
                        height={350}
                        borderRadius={10}
                        marginBottom={8}
                      />
                      <SkeletonPlaceholder.Item
                        height={14}
                        borderRadius={4}
                        marginBottom={4}
                      />
                      <SkeletonPlaceholder.Item height={14} borderRadius={4} />
                      <SkeletonPlaceholder.Item
                        marginTop={8}
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                          }}
                        />
                        <View
                          style={{
                            width: 100,
                            height: 20,
                          }}
                        />
                      </SkeletonPlaceholder.Item>
                    </>
                  </SkeletonPlaceholder>
                </View>
              );
            }
            return (
              <ItemContent navigation={navigation} item={item} key={index} />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.disable,
    height: 50,
  },
  item: {
    width: '100%',
  },
});

interface HeaderFlatListProps {
  lists: {
    title: string;
    value: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
}
const HeaderFlatList = ({lists = [], onChange, value}: HeaderFlatListProps) => {
  // const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = (itemValue: string) => {
    if (itemValue === value) {
      onChange && onChange('all');

      return;
    }
    if (onChange) {
      onChange(itemValue);
    }
  };
  // useEffect(() => {
  //   Animated.sequence([
  //     Animated.timing(scaleAnim, {
  //       toValue: 1.1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(scaleAnim, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value]);
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          height: 'auto',
        }}>
        {lists.map((item, index) => {
          const isActive = value === item.value;

          return (
            // <Animated.View
            //   key={index}
            //   style={{
            //     transform: [{scale: isActive ? scaleAnim : 1}],
            //     height: 'auto',
            //   }}>
            <Pressable
              key={index}
              onPress={() => {
                handlePress(item.value);
              }}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isActive ? colors.darkOrange2 : colors.disable,
                marginRight: 8,
                height: 32,
                backgroundColor: isActive
                  ? colors.darkOrange2
                  : colors.softGrey2,
              }}>
              <Text
                style={{
                  color: isActive ? colors.white : colors.gray,
                  fontFamily: font.semiBold,
                }}>
                {item.title}
              </Text>
            </Pressable>
            // </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const MemoHeaderFlatList = React.memo(HeaderFlatList);
