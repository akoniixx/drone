import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';

import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';
import {colors, font, icons, image} from '../../assets';
import Text from '../../components/Text';
import Body from './Body';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Campaign} from '../../datasource/CampaignDatasource';
import Spinner from 'react-native-loading-spinner-overlay';
import {mixpanel} from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';

type MissionScreenProps = {
  navigation: BottomTabNavigationProp<TabNavigatorParamList, 'mission'>;
};
const tabLists = [
  {
    title: 'ทั้งหมด',
    value: 'all',
  },
  {
    title: 'เริ่มแล้ว',
    value: 'start',
  },
  {
    title: 'เสร็จแล้ว',
    value: 'finish',
  },
  {
    title: 'หมดเขต',
    value: 'expire',
  },
];

export default function MissionScreen({navigation}: MissionScreenProps) {
  // const [selectedTab, setSelectedTab] = React.useState<string>('all');
  // const handleTabChange = (value: string) => {
  //   setSelectedTab(value);
  // };
  const [campaignImage, setCampaignImage] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const fetchImage = async () => {
    await Campaign.getImage('DRONER', 'QUATA', 'ACTIVE')
      .then(res => {
        setLoading(true);
        setCampaignImage(res.data[0].pathImageFloating);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (navigation.isFocused()) {
      fetchImage();
    }
  }, [navigation]);

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'left']}
      style={{
        flex: 1,
      }}>
      <ImageBackground
        source={image.bgHeaderMission}
        style={styles.headerContainer}>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginTop: 16,
          }}>
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('กดเข้าหน้าหลัก');
              navigation.navigate('home');
            }}>
            <Image
              source={icons.arrowLeft}
              style={{
                width: 32,
                height: 32,
                marginLeft: 16,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              color: colors.white,
              fontFamily: font.bold,
              marginBottom: 8,
            }}>
            ภารกิจ
          </Text>
          {/*
          <View
            style={{
              height: 45,
            }}
          /> */}
        </View>
      </ImageBackground>
      <Body navigation={navigation} fetchImage={fetchImage} />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 18,
          zIndex: 1,
        }}>
        {campaignImage && (
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('กดเข้าสู่หน้าแคมเปญ');
              navigation.navigate('CampaignScreen');
            }}>
            <ProgressiveImage
              borderRadius={8}
              source={{
                uri: campaignImage,
              }}
              resizeMode="cover"
              style={{width: 100, height: 60, borderRadius: 8}}
            />
          </TouchableOpacity>
        )}
      </View>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    ...Platform.select({
      ios: {
        height: 136,
        width: '100%',
        justifyContent: 'flex-end',
      },
      android: {
        height: 100,
        width: '100%',
        justifyContent: 'flex-end',
      },
    }),
  },
});
