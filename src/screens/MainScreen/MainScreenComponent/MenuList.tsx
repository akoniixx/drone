import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../../components/Text';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';
import {font} from '../../../assets';
import {mixpanel} from '../../../../mixpanel';

const menuList = [
  {
    title: 'กูรูเกษตร',
    navigateName: 'GuruScreen',
    icon: icons.guruKasetIcon,
  },
  {
    title: 'ภารกิจ',
    navigateName: 'MissionScreen',
    icon: icons.missionIcon,
  },
  {
    title: 'ข่าวสาร',
    navigateName: 'NewsScreen',
    icon: icons.newsIcon,
  },
];
interface Props {
  navigation: any;
}
export default function MenuList({navigation}: Props) {
  return (
    <View style={styles.container}>
      {menuList.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => {
              mixpanel.track('MainScreen_MenuList_Pressed', {
                menuName: item.title,
                to: item.navigateName,
              });
              navigation.navigate(item.navigateName);
            }}>
            <Image
              source={item.icon}
              style={styles.icons}
              resizeMode="contain"
            />
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: colors.softGrey2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.disable,
    borderBottomWidth: 1,
    borderTopColor: colors.disable,
    borderTopWidth: 1,
  },
  item: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.disable,
  },
  icons: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    fontFamily: font.bold,
  },
});
