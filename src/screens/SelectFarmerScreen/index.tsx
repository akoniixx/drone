import {
  View,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import colors from '../../assets/colors/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../navigations/MainNavigator';
import {font, image} from '../../assets';
import {
  callCenterDash,
  callcenterNumber,
} from '../../definitions/callCenterNumber';
import InputSearch from '../../components/Input/InputSearch';
import FooterFarmerList from './FooterFarmerList';
import {createTaskDatasource} from '../../datasource/CreateTaskDatasource';
import {mixpanel} from '../../../mixpanel';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'SelectFarmerScreen'>;
};
const mappingError = {
  NONE: 'ไม่พบเบอร์เกษตรกรในระบบ กรุณาลองอีกครั้ง \nหากต้องการเพิ่มเกษตรกรใหม่',
  PENDING: 'เบอร์เกษตรกรที่ระบุ \nยังไม่ได้ถูกอนุมัติการใช้งานจากเจ้าหน้าที่',
};
export interface Farmer {
  id: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  telephone_no: string;
  province_name: string;
  image_url: string;
  count_task_farmer: number;
}
export interface FarmerList {
  data: Farmer[];
  count: number;
}
const SelectFarmerScreen = ({navigation}: Props) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [farmerList, setFarmerList] = React.useState<FarmerList>({
    data: [],
    count: 0,
  });
  const [error, setError] = React.useState('');
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressCreate = async () => {
    try {
      setError('');
      const result = await createTaskDatasource.findFarmerByTel(searchValue);
      mixpanel.track('SelectFarmerScreen_Search_Press', {
        to: 'CreateTaskScreen',
        value: searchValue,
        error: mappingError[result.status as keyof typeof mappingError] || '',
        status: result.status,
        farmerId: result.id,
      });
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

  useEffect(() => {
    const getFarmerTopOfThree = async () => {
      try {
        const result = await createTaskDatasource.getFarmerEverBeen({
          page: 1,
          take: 3,
        });
        setFarmerList(result);
      } catch (e) {
        console.log(e);
      }
    };
    getFarmerTopOfThree();
  }, []);
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        showBackBtn
        title="สร้างงาน"
        onPressBack={onPressBack}
        styleTitle={{
          marginRight: 16,
        }}
      />
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
                {callCenterDash()}
              </Text>
            </Text>
            <View style={{marginTop: 16, paddingHorizontal: 16, width: '100%'}}>
              <InputSearch
                maxLength={10}
                placeholder={'ระบุเบอร์โทรศัพท์เกษตรกร'}
                onChangeText={text => {
                  setSearchValue(text);
                }}
                disableButton={searchValue.length < 10}
                keyboardType="number-pad"
                titleButton="สร้าง"
                onPressButton={onPressCreate}
                value={searchValue}
                errorText={error}
                showButton
                onBlur={() => {
                  mixpanel.track('SelectFarmerScreen_Search_Typed', {
                    to: 'SearchFarmerScreen',
                    value: searchValue,
                  });
                }}
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
                    mixpanel.track('SelectFarmerScreen_SeeAll_Press', {
                      to: 'AllFarmerListScreen',
                    });
                    navigation.navigate('AllFarmerListScreen');
                  }}>
                  <Text style={styles.textSeeAll}>ดูทั้งหมด</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FooterFarmerList navigation={navigation} farmerList={farmerList} />
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
    paddingTop: 16,
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
