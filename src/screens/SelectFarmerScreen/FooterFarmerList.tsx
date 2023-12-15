import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import CardFarmer from '../../components/CardFarmer/CardFarmer';

type Props = {
  navigation: any;
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
];

export interface Farmer {
  image: string;
  name: string;
  nickname: string | null;
  id: string;
  tel: string;
  address: {
    subDistrict: string;
    district: string;
    province: string;
  };
}
const FooterFarmerList = ({navigation}: Props) => {
  return (
    <FlatList
      data={mockData}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        return <CardFarmer item={item} navigation={navigation} />;
      }}
    />
  );
};

export default FooterFarmerList;

const styles = StyleSheet.create({});
