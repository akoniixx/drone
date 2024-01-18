import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors} from '../../assets';
import {Dimensions, Image, SafeAreaView, Text, View} from 'react-native';
import {mixpanel} from '../../../mixpanel';
import ZoomableImage from '../../components/ZoomableImage/ZoomableImage';

const DateCampaignScreen: React.FC<any> = ({navigation, route}) => {
  const width = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="ตารางการจับรางวัล"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('กดย้อนกลับจากหน้าตารางจับรางวัล');
          navigation.goBack();
        }}
      />

      <View style={{flex: 1, alignItems: 'center'}}>
        <ZoomableImage
          source={{
            uri: route.params.image,
          }}
          style={{width: width - 15, height: width - 15}}
        />
      </View>
    </SafeAreaView>
  );
};

export default DateCampaignScreen;
