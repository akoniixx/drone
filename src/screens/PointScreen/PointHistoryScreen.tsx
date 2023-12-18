import React from 'react';
import {Image, View} from 'react-native';
import {colors, font, icons} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '../../function/Normalize';
import {numberWithCommas} from '../../function/utility';
import LinearGradient from 'react-native-linear-gradient';
import PointTapNavigator from '../../navigations/topTabs/PointTapNavigator';
import {usePoint} from '../../contexts/PointContext';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';

const DetailPointScreen: React.FC<any> = ({navigation}) => {
  const {currentPoint} = usePoint();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.grayBg,
      }}>
      <View>
        <CustomHeader
          title="ประวัติการได้รับ/ใช้แต้ม"
          showBackBtn
          onPressBack={() => {
            mixpanel.track('กดกลับจากหน้าประวัติการได้รับ/ใช้แต้ม');
            navigation.goBack();
          }}
        />
      </View>
      <LinearGradient
        colors={['#FA7052', '#F89132']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{alignItems: 'center', paddingVertical: normalize(10)}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={icons.point}
            style={{
              width: normalize(35),
              height: normalize(35),
            }}
          />
          <Text
            style={{
              fontFamily: font.bold,
              color: 'white',
              fontSize: normalize(18),
              marginLeft: normalize(15),
              marginRight: normalize(5),
            }}>
            {numberWithCommas(currentPoint.toString(), true)} แต้ม
          </Text>
        </View>
      </LinearGradient>
      <PointTapNavigator />
    </View>
  );
};
export default DetailPointScreen;

// const styles = StyleSheet.create({
//   inner: {
//     marginTop: normalize(50),
//     paddingHorizontal: normalize(17),
//   },
//   container: {
//     flex: 1,
//   },
//   HeadBg: {
//     width: '100%',
//     height: normalize(140),
//     backgroundColor: colors.green,
//   },
//   empty: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     display: 'flex',
//     paddingVertical: '50%',
//   },
//   textEmpty: {
//     fontFamily: font.regular,
//     fontSize: normalize(18),
//     lineHeight: normalize(30),
//     textAlign: 'center',
//     color: colors.fontGrey,
//   },
// });
