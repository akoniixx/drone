import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {colors, font, icons} from '../../assets';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {SheetManager} from 'react-native-actions-sheet';
import {BASE_URL, httpClient} from '../../config/develop-config';
import Text from '../../components/Text';
import CardRedeemDigital from '../../components/CardRedeemDigital/CardRedeemDigital';
import moment from 'moment';
import Modal from '../../components/Modal/Modal';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import AsyncButton from '../../components/Button/AsyncButton';

interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemScreen'>;
}
interface Branch {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  nameEn: string | null;
  updatedAt: string;
}
interface CompanyData {
  id: string;
  name: string;
  companyCode: string;
  createdAt: string;
  isActive: boolean;
  nameEn: string | null;
  imagePath: string;
}

export default function RedeemScreen({navigation, route}: Props) {
  const {data, imagePath, expiredUsedDate} = route.params;
  const [selectedArea, setSelectedArea] = React.useState<any>(null);
  const [companyData, setCompanyData] = React.useState<{
    data: CompanyData[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const isExpired = React.useMemo(() => {
    return moment(expiredUsedDate).isBefore(moment());
  }, [expiredUsedDate]);
  const [dataBranch, setDataBranch] = React.useState<Branch[]>([]);
  const [showBrandModal, setShowBrandModal] = React.useState(false);
  useEffect(() => {
    const getBranch = async () => {
      try {
        const result = await httpClient.get(BASE_URL + '/branch');
        setDataBranch(result.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getBranch();
  }, []);
  const onSelectedBrand = async () => {
    const result: {
      selected: any;
    } = await SheetManager.show('selectArea', {
      payload: {
        selected: selectedArea,
        data: dataBranch,
        dronerTransactionId: data.dronerTransaction.id,
        navigation,
      },
    });
    if (result?.selected) {
      setSelectedArea(result.selected);
    }
  };
  const onShowBrand = async () => {
    setShowBrandModal(true);
    try {
      const result = await rewardDatasource.getAllCompany();
      setCompanyData(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <CustomHeader
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 16,
              }}>
              <Image
                source={icons.closeBlack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView contentContainerStyle={{flexGrow: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <CardRedeemDigital
              imagePath={imagePath}
              data={data}
              expiredUsedDate={expiredUsedDate}
            />
            <View style={styles.warningBox}>
              <Image
                source={icons.warningDanger}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  flex: 0.95,
                  marginLeft: 8,
                  fontSize: 12,
                  fontFamily: font.medium,
                  color: colors.decreasePoint,
                }}>
                ท่านสามารถใช้ส่วนลดนี้ โดยไปที่หน้าสาขาที่ต้องการใช้บริการ
                พร้อมยื่นแสดงหน้าจอส่วนลดนี้ให้กับเจ้าหน้าที่เพื่อให้เจ้าหน้าที่
                ยืนยันการใช้สิทธิ์
              </Text>
            </View>
          </View>
          {!isExpired && (
            <View
              style={{
                marginVertical: 16,
              }}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={onShowBrand}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 20,
                    fontFamily: font.bold,
                  }}>
                  กดรับสิทธิ์ (เฉพาะเจ้าหน้าที่)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal visible={showBrandModal}>
        <View style={styles.containerBrand}>
          <Text style={styles.titleModal}>เลือกบริษัทที่ใช้สิทธิ์</Text>
          <Text style={styles.desc}>เลือกบริษัทที่ใช้สิทธิ์</Text>
          <AsyncButton
            title="close"
            onPress={() => {
              setShowBrandModal(false);
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  desc: {
    fontSize: 16,
    fontFamily: font.light,
    color: colors.fontBlack,
  },
  titleModal: {
    fontSize: 20,
    fontFamily: font.semiBold,
  },
  containerBrand: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.grey3,
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 72,
  },
  cardContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.grey3,
    borderRadius: 10,
    backgroundColor: 'white',
    minHeight: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.decreasePoint,
    padding: 8,
    marginTop: 16,
    minHeight: 58,
    flexDirection: 'row',
  },
});
