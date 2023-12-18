import {
  Image,
  Linking,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useMemo} from 'react';
import Text from '../../components/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, image} from '../../assets';
import AsyncButton from '../../components/Button/AsyncButton';
import {mixpanel} from '../../../mixpanel';
import RNExitApp from 'react-native-kill-app';
import VersionCheck from 'react-native-version-check';
import {navigate} from '../../navigations/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForceUpdateScreen({route}: any) {
  const {isForce = false, isDev = false} = route.params;

  const {width} = useWindowDimensions();
  const widthButton = useMemo(() => {
    return width / 2 - 32;
  }, [width]);
  const onPressLater = async () => {
    await AsyncStorage.setItem('updateLater', 'true');
    mixpanel.track('กดอัพเดทแอพภายหลัง');
    navigate('initPage', {});
  };

  const onPressUpdate = async () => {
    try {
      const isIOS = Platform.OS === 'ios';
      const storeUrl = await VersionCheck.getAppStoreUrl({
        appID: '6443516628',
      });

      const playStoreUrl = await VersionCheck.getPlayStoreUrl({
        packageName: 'com.iconkaset.droner',
      });
      mixpanel.track('กดอัพเดทแอพ');
      await AsyncStorage.removeItem('updateLater');
      await Linking.openURL(isIOS ? storeUrl : playStoreUrl);
      RNExitApp.exitApp();
    } catch (e) {
      console.log(e);
    } finally {
      RNExitApp.exitApp();
    }
  };
  const onPressByPassDev = async () => {
    await AsyncStorage.setItem('updateLater', 'true');
    navigate('initPage', {});
  };

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'left', 'top']}
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        paddingBottom: 16,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={image.updateApp}
            style={{
              width: 210,
              height: 320,
            }}
          />
          <Text
            style={{
              marginVertical: 16,
              fontSize: 20,
              fontFamily: font.bold,
            }}>
            แอปฯ เวอร์ชั่นใหม่มาแล้วจ้า!
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: font.regular,
              color: colors.gray,
            }}>
            แอปฯ ไอคอนเกษตรนักบินโดรน พร้อมให้คุณได้อัปเดตแล้ว
            เพื่อเพิ่มประสบการณ์และสิทธิพิเศษใหม่ที่ดีกว่าเดิม
          </Text>
        </View>
      </View>
      {isDev && (
        <AsyncButton
          title="ByPassDev"
          onPress={onPressByPassDev}
          style={{
            marginBottom: 16,
          }}
        />
      )}

      {isForce ? (
        <View
          style={{
            flexDirection: 'row',
          }}>
          <AsyncButton title="อัปเดตเลย!" onPress={onPressUpdate} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AsyncButton
            title="ภายหลัง"
            type="secondary"
            style={{
              width: widthButton,
            }}
            onPress={onPressLater}
          />
          <AsyncButton
            onPress={async () => {
              onPressUpdate();
              await AsyncStorage.removeItem('Maintenance');
            }}
            title="อัปเดตเลย!"
            style={{
              width: widthButton,
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
