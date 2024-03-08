import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors} from '../../assets';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {mixpanel} from '../../../mixpanel';
import ZoomableImage from '../../components/ZoomableImage/ZoomableImage';
import ImageZoom from 'react-native-image-pan-zoom';

const DateCampaignScreen: React.FC<any> = ({navigation, route}) => {
  const width = Dimensions.get('window').width;
  const props: any = {
    imageWidth: width - 15,
    imageHeight: width - 15,
    cropWidth: width,
    cropHeight: width,
  };
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

      <View style={{flex: 1, alignItems: 'center', overflow: 'hidden'}}>
        <View style={styles.imageZoomContainer}>
          <ImageZoom {...props}>
            <Image
              style={{width: width - 15, height: width - 15}}
              source={{
                uri: route.params.image,
              }}
            />
          </ImageZoom>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  imageZoomContainer: {
    width: '100%',
    height: '100%',
  },
});
export default DateCampaignScreen;
