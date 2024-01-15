import {normalize} from '@rneui/themed';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, image} from '../../assets';
import MainTaskTapNavigator from '../../navigations/topTabs/MainTaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';

import RegisterNotification from '../../components/Modal/RegisterNotification';
import Text from '../../components/Text';
import icons from '../../assets/icons/icons';
import {mixpanel} from '../../../mixpanel';

const MainTaskScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  // const initialTab = route?.params?.initialTab || 0;
  const [index, setIndex] = useState(0);

  const [openNoti, setOpenNoti] = useState(false);

  const onPressCreateTask = () => {
    mixpanel.track('MainTaskScreen_CreateTask_Press', {
      to: 'SelectFarmerScreen',
    });
    navigation.navigate('SelectFarmerScreen');
  };

  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <RegisterNotification
        value={openNoti}
        onClick={() => {
          setOpenNoti(false);
          navigation.navigate('ProfileScreen', {
            navbar: false,
          });
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: normalize(20),
          backgroundColor: colors.white,
        }}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.fontBlack,
          }}>
          งานของฉัน
        </Text>
        <TouchableOpacity style={styles.button} onPress={onPressCreateTask}>
          <Image
            source={icons.plusWhite}
            style={{
              width: normalize(16),
              height: normalize(16),
              marginRight: normalize(4),
            }}
          />
          <Text style={styles.text}>สร้างงานใหม่</Text>
        </TouchableOpacity>
      </View>
      <MainTaskTapNavigator index={index} setIndex={setIndex} />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.orange,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: font.bold,
    fontSize: 16,
    color: colors.white,
  },
});
export default MainTaskScreen;
