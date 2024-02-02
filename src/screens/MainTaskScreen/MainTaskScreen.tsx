import {normalize} from '@rneui/themed';
import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import MainTaskTapNavigator from '../../navigations/topTabs/MainTaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import RegisterNotification from '../../components/Modal/RegisterNotification';
import Text from '../../components/Text';
import icons from '../../assets/icons/icons';
import {mixpanel} from '../../../mixpanel';
import {SheetManager} from 'react-native-actions-sheet';
import {
  CurrentFilterType,
  StatusFinish,
  StatusListExtend,
  StatusPayment,
} from '../../components/Sheet/SheetFilterTask';

export const mappingTab = [
  {key: 'inprogress', title: 'กำลังดำเนินการ'},
  {key: 'waitStart', title: 'รอเริ่มงาน'},
  {key: 'finish', title: 'งานเสร็จสิ้น'},
];

const initialFilter: CurrentFilterType = {
  sortByField: {
    label: 'งานที่ใกล้ถึง',
    sortDirection: 'DESC',
    value: 'dateAppointment',
  },
  listStatus: StatusListExtend,
  paymentStatus: StatusPayment,
};
const MainTaskScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  // const initialTab = route?.params?.initialTab || 0;
  const [index, setIndex] = useState(0);
  const [currentFilter, setCurrentFilter] =
    useState<CurrentFilterType>(initialFilter);

  const [openNoti, setOpenNoti] = useState(false);
  const currentTab = useMemo(() => {
    return mappingTab[index];
  }, [index]);
  const onPressCreateTask = () => {
    mixpanel.track('MainTaskScreen_CreateTask_Press', {
      to: 'SelectFarmerScreen',
    });
    navigation.navigate('SelectFarmerScreen');
  };
  const onOpenFilter = async () => {
    mixpanel.track('MainTaskScreen_Filter_Press');
    const result: {
      currentFilter: CurrentFilterType;
    } = await SheetManager.show('selectFilterTask', {
      payload: {
        currentTab: currentTab,
        currentFilter: currentFilter,
      },
    });
    if (result?.currentFilter) {
      console.log(JSON.stringify(result.currentFilter, null, 2));

      setCurrentFilter(result.currentFilter);
    }
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
        <View style={styles.row}>
          <TouchableOpacity
            onPress={onOpenFilter}
            style={{
              marginRight: normalize(12),
            }}>
            <Image
              source={icons.filter}
              style={{
                width: normalize(24),
                height: normalize(24),
              }}
            />
          </TouchableOpacity>
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
      </View>
      <MainTaskTapNavigator
        index={index}
        currentFilter={currentFilter}
        setIndex={index => {
          setIndex(index);
          const currentTab = mappingTab[index];
          let filter = initialFilter;
          let paymentStatus = [] as typeof StatusPayment;
          if (currentTab.key === 'inprogress') {
            filter.listStatus = StatusListExtend;
          }
          if (currentTab.key === 'finish') {
            filter.listStatus = StatusFinish;
            paymentStatus = StatusPayment;
          }
          if (currentTab.key === 'waitStart') {
            filter.listStatus = [];
          }
          setCurrentFilter({
            sortByField: initialFilter.sortByField,
            listStatus: filter.listStatus,
            paymentStatus,
          });
        }}
      />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default MainTaskScreen;
