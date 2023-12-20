import {
  View,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import colors from '../../assets/colors/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../navigations/MainNavigator';
import {font, image} from '../../assets';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import InputSearch from '../../components/Input/InputSearch';
import FooterFarmerList from './FooterFarmerList';
import {createTaskDatasource} from '../../datasource/CreateTaskDatasource';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'SelectFarmerScreen'>;
};
const mappingError = {
  NONE: 'ไม่พบเบอร์เกษตรกรในระบบ กรุณาลองอีกครั้ง หากต้องการเพิ่มเกษตรกรใหม่',
  PENDING: 'เบอร์เกษตรกรที่ระบุ ยังไม่ได้ถูกอนุมัติการใช้งานจากเจ้าหน้าที่',
};

const SelectFarmerScreen = ({navigation}: Props) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [error, setError] = React.useState('');
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressCreate = async () => {
    try {
      setError('');
      const result = await createTaskDatasource.findFarmerByTel(searchValue);
      if (result) {
        switch (result.status) {
          case 'PENDING': {
            setError(mappingError[result.status as keyof typeof mappingError]);
            break;
          }
          case 'NONE': {
            setError(mappingError[result.status as keyof typeof mappingError]);
            break;
          }
          default: {
            navigation.navigate('CreateTaskScreen', {
              farmerId: result.id,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onPressTel = () => {
    Linking.openURL(`tel:${callcenterNumber}`);
  };
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader showBackBtn title="สร้างงาน" onPressBack={onPressBack} />
      <View style={styles.container}>
        <Image
          source={image.createTaskBg}
          style={{
            width: '100%',
            height: 135,
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.content}>
            <Text style={styles.title}>สร้างงานในระบบด้วยตัวเอง</Text>
            <Text style={styles.desc}>
              หากมีปัญหาในการสร้างงานจ้างฉีดพ่น/หว่าน
            </Text>
            <Text style={styles.desc}>
              กรุณาติดต่อเจ้าหน้าที่​ โทร.{' '}
              <Text style={styles.telText} onPress={onPressTel}>
                02-233-9000
              </Text>
            </Text>
            <View style={{marginTop: 16, paddingHorizontal: 16}}>
              <InputSearch
                maxLength={10}
                placeholder={'ระบุเบอร์โทรศัพท์เกษตรกร'}
                onChangeText={text => {
                  setSearchValue(text);
                }}
                keyboardType="number-pad"
                titleButton="สร้าง"
                onPressButton={onPressCreate}
                value={searchValue}
                showButton
              />
              <View style={{height: 16}} />
              <View style={styles.rowTitle}>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: 16,
                  }}>
                  เกษตรกรที่จ้างบ่อย
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AllFarmerListScreen');
                  }}>
                  <Text style={styles.textSeeAll}>ดูทั้งหมด</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FooterFarmerList navigation={navigation} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 8,
  },
  desc: {
    fontFamily: font.light,
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray,
  },
  telText: {
    fontFamily: font.light,
    fontSize: 16,
    color: colors.darkBlue,
    textDecorationLine: 'underline',
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  textSeeAll: {
    fontFamily: font.medium,
    fontSize: 16,
    color: colors.orange,
  },
});

export default SelectFarmerScreen;
