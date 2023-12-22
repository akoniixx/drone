import {FlatList} from 'react-native';
import React from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import EmptyFarmerList from '../../components/EmptyComponent/EmptyFarmerList';
import {Farmer} from '.';

type Props = {
  navigation: any;
  farmerList: {
    data: Farmer[];
    count: number;
  };
};

const FooterFarmerList = ({navigation, farmerList}: Props) => {
  return (
    <FlatList
      data={farmerList.data || []}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      ListEmptyComponent={<EmptyFarmerList isMain />}
      keyExtractor={item => item?.id}
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
  );
};

export default FooterFarmerList;
