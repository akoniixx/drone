import {
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import InputSearch from '../../components/Input/InputSearch';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import EmptyFarmerList from '../../components/EmptyComponent/EmptyFarmerList';
import {FarmerList} from '../SelectFarmerScreen';
import {createTaskDatasource} from '../../datasource/CreateTaskDatasource';
import {useDebounce} from '../../hooks/useDebounce';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'AllFarmerListScreen'>;
};
const take = 8;
const initialPage = 1;
const AllFarmerListScreen = ({navigation}: Props) => {
  const [searchValue, setSearchValue] = React.useState('');
  const debounceValue = useDebounce(searchValue, 800);
  const [page, setPage] = React.useState(initialPage);
  const [farmerList, setFarmerList] = React.useState<FarmerList>({
    data: [],
    count: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const onPressBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const getFarmerTopOfThree = async () => {
      try {
        setLoading(true);
        const result = await createTaskDatasource.getFarmerEverBeen({
          page: initialPage,
          take,
          search: debounceValue,
        });
        setFarmerList(result);
        setLoading(false);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getFarmerTopOfThree();
  }, [debounceValue]);
  const onEndReached = async () => {
    try {
      if (farmerList.data.length >= farmerList.count) {
        return;
      }
      const result = await createTaskDatasource.getFarmerEverBeen({
        page: page + 1,
        take,
        search: debounceValue,
      });
      setFarmerList({
        data: [...farmerList.data, ...result.data],
        count: result.count,
      });
      setPage(page + 1);
    } catch (e) {
      console.log(e);
    }
  };
  const onTypeSearch = async (text: string) => {
    setSearchValue(text);
    setPage(initialPage);
  };
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        title="รายชื่อเกษตรกรทั้งหมด"
        showBackBtn
        onPressBack={onPressBack}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss;
        }}>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            ListEmptyComponent={() => {
              return <EmptyFarmerList />;
            }}
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<View style={{height: 100}} />}
            ListHeaderComponent={
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingBottom: 16,
                }}>
                <InputSearch
                  placeholder={'ค้นหาชื่อจริง / ชื่อเล่น / เบอร์โทร'}
                  onChangeText={onTypeSearch}
                  value={searchValue}
                />
              </View>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={() => {
              return (
                <SkeletonPlaceholder
                  speed={2000}
                  backgroundColor={colors.skeleton}>
                  <SkeletonPlaceholder.Item
                    borderRadius={8}
                    marginBottom={16}
                    height={75}
                  />
                </SkeletonPlaceholder>
              );
            }}
          />
        ) : (
          <FlatList
            data={farmerList.data || []}
            ListEmptyComponent={() => {
              return <EmptyFarmerList />;
            }}
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<View style={{height: 100}} />}
            ListHeaderComponent={
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingBottom: 16,
                }}>
                <InputSearch
                  placeholder={'ค้นหาชื่อจริง / ชื่อเล่น / เบอร์โทร'}
                  onChangeText={onTypeSearch}
                  value={searchValue}
                />
              </View>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={({item}) => {
              const newItem: any = {
                id: item.id,
                firstname: item.firstname,
                lastname: item.lastname,
                nickname: item.nickname,
                telephoneNo: item.telephone_no,
                province: item.province_name,
              };
              return (
                <CardFarmer
                  item={newItem}
                  navigation={navigation}
                  imageURL={item.image_url}
                />
              );
            }}
          />
        )}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AllFarmerListScreen;
