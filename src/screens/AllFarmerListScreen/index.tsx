import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import InputSearch from '../../components/Input/InputSearch';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import EmptyFarmerList from '../../components/EmptyComponent/EmptyFarmerList';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'AllFarmerListScreen'>;
};
const mockData = [
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมชาย ใจดี',
    nickname: null,
    id: '1',
    tel: '0812345678',
    address: {
      subDistrict: 'สุรินทร์',
      district: 'สุรินทร์',
      province: 'สุรินทร์',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
  {
    image: 'https://picsum.photos/200/300',
    name: 'นายสมัย สนุกสนาน',
    nickname: 'สมัย',
    id: '2',
    tel: '0812345678',
    address: {
      subDistrict: 'ร้อยเอ็ด',
      district: 'ร้อยเอ็ด',
      province: 'ร้อยเอ็ด',
    },
  },
];

const AllFarmerListScreen = ({navigation}: Props) => {
  const [searchValue, setSearchValue] = React.useState('');
  const onPressBack = () => {
    navigation.goBack();
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
        <FlatList
          data={mockData}
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
                onChangeText={text => {
                  setSearchValue(text);
                }}
                value={searchValue}
              />
            </View>
          }
          renderItem={({item}) => {
            return <CardFarmer item={item} navigation={navigation} />;
          }}
        />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AllFarmerListScreen;

const styles = StyleSheet.create({
  container: {},
});
