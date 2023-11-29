import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
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

interface Props {
  navigation: any;
}
const mockData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const initialListsHeader = [
  {
    title: 'ทั้งหมด',
    value: 'all',
  },
  {
    title: 'โรคพืช',
    value: 'plantDisease',
  },
  {
    title: 'การใช้ยา',
    value: 'useMedicine',
  },
  {
    title: 'การใช้ปุ๋ย',
    value: 'useFertilizer',
  },
  {
    title: 'การใช้สารเคมี',
    value: 'useChemical',
  },
];
export default function GuruScreen({navigation}: Props) {
  const [listsHeader, setListsHeader] = React.useState(initialListsHeader);
  const [currentTabHeader, setCurrentTabHeader] = React.useState('all');
  const [currentTab, setCurrentTab] = React.useState('all');

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
        const getListGroupGuru = await GuruKaset.getGroupGuru();
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

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
          <GuruTapNavigator
            onChange={(value: string) => {
              setCurrentTab(value);
            }}
            value={currentTab}
          />
        </View>
        <MemoHeaderFlatList
          lists={listsHeader}
          value={currentTabHeader}
          onChange={(value: string) => {
            setCurrentTabHeader(value);
          }}
        />
        <FlatList
          scrollEventThrottle={64}
          onScroll={handleScroll}
          data={mockData}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          // ListHeaderComponent={() => {
          //   return (
          //     <Animated.View
          //       style={{
          //         transform: [{translateY: headerTranslateY}],
          //       }}></Animated.View>
          //   );
          // }}
          renderItem={() => {
            return <ItemContent navigation={navigation} />;
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = (itemValue: string) => {
    if (onChange) {
      onChange(itemValue);
    }
  };
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        height: 'auto',
        marginBottom: 16,
      }}>
      {lists.map((item, index) => {
        const isActive = value === item.value;
        return (
          <Animated.View
            key={index}
            style={{
              transform: [{scale: isActive ? scaleAnim : 1}],
              height: 'auto',
            }}>
            <Pressable
              key={index}
              onPress={() => {
                if (isActive) {
                  return;
                }
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
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};
const MemoHeaderFlatList = React.memo(HeaderFlatList);
