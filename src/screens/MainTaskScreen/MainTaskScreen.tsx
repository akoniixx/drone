import {normalize} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import MainTaskTapNavigator from '../../navigations/topTabs/MainTaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';

import RegisterNotification from '../../components/Modal/RegisterNotification';

const MainTaskScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [openNoti, setOpenNoti] = useState(false);
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
          alignItems: 'center',
          paddingVertical: normalize(20),
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
      </View>
      <MainTaskTapNavigator />
    </View>
  );
};
export default MainTaskScreen;
