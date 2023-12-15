import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, icons, image as img} from '../../../assets';
import {normalize} from '../../../function/Normalize';
import {stylesCentral} from '../../../styles/StylesCentral';
import * as ImagePicker from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {Authentication} from '../../../datasource/AuthDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SimpleAccordion} from 'react-native-simple-accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../../datasource/ProfileDatasource';
import AsyncButton from '../../../components/Button/AsyncButton';
import CustomHeader from '../../../components/CustomHeader';
import AnimatedInput from '../../../components/Input/AnimatedInput';
import {RouteProp} from '@react-navigation/native';
import Text from '../../../components/Text';
import DashedLine from 'react-native-dashed-line';
import ModalRN from '../../../components/Modal/Modal';
import {useAuth} from '../../../contexts/AuthContext';
import {StackParamList} from '../../../navigations/MainNavigator';
const width = Dimensions.get('window').width;

interface PropsParams {
  navigation: any;
  route: RouteProp<StackParamList, 'UploadBankingScreen'>;
}

const UploadBankingScreen: React.FC<PropsParams> = ({navigation, route}) => {
  const profile = route.params.profile;
  const [nameAccount, setNameAccount] = useState<string>('');
  const [numAccount, setNumAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([
    {
      bankName: '',
      logoPath: '',
    },
  ]);
  const [openBankDropdown, setOpenBankDropdown] = useState(false);
  const [bankValue, setBankValue] = useState('');
  const [image, setImage] = useState<any>(null);
  const [checked1, setChecked1] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>('');
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [previousBookbank, setPreviousBookbank] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const {authContext} = useAuth();

  const bankItems = banks.map(bank => ({
    label: bank.bankName,
    value: bank.bankName,
    labelStyle: {
      fontSize: 16,
      fontFamily: font.medium,
      color: colors.fontBlack,
    },
    icon: () => <Image source={{uri: bank.logoPath}} style={styles.bankIcon} />,
  }));

  useEffect(() => {
    getImg();
    fetchBank();
    setBankValue(profile.bankName);
    setNameAccount(profile.bankAccountName);
    setNumAccount(profile.accountNumber);
    setChecked1(profile.isConsentBookBank);
    if (route.params.bookBank) {
      setPreviousBookbank(route.params.bookBank);
    }

    /*   console.log(previousBookbank) */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImg = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.getImgePath(droner_id!, route.params.bookBank.path).then(
      res => {
        setImageURL(res.url);
      },
    );
  };

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, []);

  const fetchBank = () => {
    setLoading(true);
    Authentication.getBankList()
      .then(res => {
        setBanks(res);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = () => {
    setToggleModal(false);
    setLoading(true);
    Authentication.uploadBankImage(image)
      .then(() => {
        Authentication.updateBookbank(
          true,
          bankValue,
          nameAccount,
          numAccount,
          checked1,
        )
          .then(async () => {
            await authContext.getProfileAuth();
            setShowSuccess(true);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const condition = (
    <View style={{backgroundColor: '#FAFAFB'}}>
      <Text
        style={{
          fontSize: 14,
        }}>
        - กรณีหน้าสมุดบัญชีธนาคารที่ยื่นไม่ใช่ชื่อสมุดบัญชีธนาคารของท่าน
        กรุณาแนบภาพสำเนาสมุดบัญชีธนาคารบุคคลที่ท่านต้องการ พร้อมเซ็นสำเนาถูกต้อง
        พร้อมชื่อและนามสกุลของท่านลงบนเอกสาร
      </Text>
      <Text
        style={{
          fontSize: 14,
        }}>
        - เมื่อท่านติ๊กเลือกยินยอมในข้อตกลง (1) ถือว่าท่านยืนยันความถูกต้อง
        และครบถ้วนของข้อมูล หากเกิดข้อผิดพลาดใดๆ
        ทางบริษัทจะไม่รับผิดชอบในความเสียหายที่เกิดขึ้นทุกกรณี
        กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดบันทึก
      </Text>
      <Text
        style={{
          fontSize: 14,
        }}>
        - สอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่ โทร. 02-233-9000
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        title={'อัปโหลดสมุดบัญชีธนาคาร'}
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.body}>
          <View style={{marginVertical: normalize(16)}}>
            <Text style={styles.h1}>ระบุบัญชีธนาคาร</Text>
          </View>

          <DropDownPicker
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            zIndex={3000}
            zIndexInverse={1000}
            style={{
              marginVertical: 10,
              backgroundColor: colors.white,
              borderColor: colors.grey3,
              height: 56,
            }}
            placeholder="เลือกธนาคาร"
            placeholderStyle={{
              color: colors.grey3,
              fontFamily: font.regular,
              fontSize: 16,
            }}
            open={openBankDropdown}
            value={bankValue}
            items={bankItems}
            setOpen={setOpenBankDropdown}
            setValue={setBankValue}
            listItemContainerStyle={{
              marginBottom: 16,
            }}
            labelStyle={{
              fontSize: 16,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={{
              borderColor: colors.disable,
              marginBottom: 40,
            }}
          />
          <AnimatedInput
            onChangeText={value => {
              setNameAccount(value);
            }}
            style={{
              marginTop: 8,
            }}
            label="ชื่อบัญชี"
            value={nameAccount}
          />

          <AnimatedInput
            onChangeText={value => {
              setNumAccount(value);
            }}
            style={{
              marginTop: 8,
            }}
            label="เลขที่บัญชี"
            value={numAccount}
            keyboardType={'number-pad'}
          />

          <View style={{marginTop: 8}}>
            <Text style={styles.h1}>อัปโหลดหน้าสมุดบัญชีธนาคาร</Text>
          </View>

          <TouchableOpacity
            style={{
              marginVertical: 8,
            }}
            onPress={onAddImage}>
            {image === null && previousBookbank === null ? (
              <>
                <View
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: 162,
                  }}>
                  <DashedLine
                    dashColor={colors.orange}
                    dashGap={6}
                    dashLength={10}
                    axis="vertical"
                    style={{
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      width: 2,
                      zIndex: 100,
                    }}
                  />
                  <DashedLine
                    dashColor={colors.orange}
                    dashGap={6}
                    dashLength={10}
                    axis="vertical"
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '100%',
                      width: 2,
                      zIndex: 100,
                    }}
                  />
                  <DashedLine
                    dashColor={colors.orange}
                    dashGap={6}
                    dashLength={10}
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      zIndex: 100,
                    }}
                  />
                  <DashedLine
                    dashColor={colors.orange}
                    dashGap={6}
                    dashLength={10}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      zIndex: 100,
                    }}
                  />
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: 12,
                      backgroundColor: colors.grayBg,
                    }}>
                    <View style={styles.camera}>
                      <Image
                        source={icons.upload}
                        style={{
                          width: 28,
                          height: 28,
                        }}
                      />
                    </View>
                    <Text>เพิ่มเอกสารด้วย ไฟล์รูป หรือ PDF</Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: normalize(76),
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFBF6',
                  borderColor: '#FF981E',
                  borderWidth: 1,
                  paddingHorizontal: normalize(10),
                }}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    source={{
                      uri:
                        image == null && previousBookbank !== null
                          ? imageURL
                          : image?.assets?.[0].uri,
                    }}
                    style={{
                      width: normalize(36),
                      height: normalize(36),
                      borderRadius: 8,
                    }}
                  />
                  <View style={{width: '70%', marginLeft: 10}}>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                      {image == null && previousBookbank !== null
                        ? previousBookbank?.fileName
                        : image?.assets?.[0].fileName}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                  }}
                  onPress={() => {
                    setImage(null);
                    setPreviousBookbank(null);
                    setImageURL('');
                  }}>
                  <Image
                    source={icons.closeBlack}
                    style={{width: normalize(16), height: normalize(16)}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChecked1(!checked1)}
            style={{
              marginBottom: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: normalize(10),
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 24,
                }}>
                {checked1 ? (
                  <Image
                    resizeMode="contain"
                    source={icons.checked}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                ) : (
                  <Image
                    source={icons.check}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                )}
              </View>

              <View
                style={{
                  marginLeft: normalize(10),
                  alignSelf: 'flex-start',
                  flex: 1,
                }}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.fontBlack,
                      fontSize: 14,
                    },
                  ]}>
                  ข้าพเจ้ายินยอมให้โอนเงินเข้าชื่อบัญชีธนาคารบุคคล
                  ดังกล่าวที่ไม่ใช่ชื่อบัญชีธนาคารของข้าพเจ้า (1)
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <SimpleAccordion
            viewInside={condition}
            title={'หมายเหตุ กรณียื่นบัญชีธนาคารเป็นบุคคลอื่น'}
            titleStyle={{
              fontFamily: font.regular,
              fontSize: 14,
              color: '#B26003',
            }}
            bannerStyle={{backgroundColor: '#FAFAFB', borderRadius: 8}}
            viewContainerStyle={{
              backgroundColor: '#FAFAFB',
              shadowOpacity: 0,
              borderRadius: 8,
            }}
          />
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: normalize(17)}}>
        <AsyncButton
          title="บันทึก"
          onPress={() => setToggleModal(true)}
          disabled={image === null}
        />
      </View>

      <Modal transparent={true} visible={toggleModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(4, 19, 10, 0.3)',
            paddingHorizontal: normalize(16),
          }}>
          <View
            style={{
              paddingVertical: normalize(24),
              paddingHorizontal: normalize(16),
              backgroundColor: 'white',
              borderRadius: 16,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.h1}>บันทึกการส่งเอกสาร?</Text>
              <Text style={styles.label}>กรุณาตรวจสอบเอกสารและรายละเอียด</Text>
              <Text style={styles.label}>
                ของคุณให้ถูกต้อง หากข้อมูลไม่ถูกต้อง
              </Text>
              <Text style={styles.label}>จะส่งผลต่อการรับงานบินโดรน</Text>
            </View>
            <View
              style={{
                marginTop: 16,
              }}>
              <AsyncButton title="บันทึก" onPress={onSubmit} />
              <AsyncButton
                title="ยกเลิก"
                noBorder
                style={{
                  marginTop: 8,
                }}
                type="secondary"
                onPress={() => setToggleModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <ModalRN
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.white,
            width: '100%',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={img.imageUploadBookBank}
            style={{
              width: 130,
              height: 110,
              marginTop: 16,
            }}
          />
          <Text
            style={{
              fontFamily: font.semiBold,
              fontSize: 20,
              marginVertical: 16,
              marginBottom: 24,
            }}>
            เพิ่มบัญชีธนาคารสำเร็จ
          </Text>
          <AsyncButton
            title="ตกลง"
            onPress={async () => {
              try {
                setShowSuccess(false);
                navigation.goBack();
              } catch (err) {
                console.log('err', err);
              }
            }}
          />
        </View>
      </ModalRN>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#E5E5E5'}}
      />
    </SafeAreaView>
  );
};
export default UploadBankingScreen;

const styles = StyleSheet.create({
  appBarBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },

  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
    color: colors.fontBlack,
  },
  header: {
    fontFamily: font.bold,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(5),
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  body: {
    paddingHorizontal: 16,
  },
  h1: {
    fontFamily: font.medium,
    fontSize: normalize(16),
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: '#DCDFE3',
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
  addImage: {
    width: width * 0.9,
    height: normalize(162),
    borderColor: '#FF981E',
    borderStyle: 'dotted',
    borderWidth: 2,
    backgroundColor: '#FAFAFB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  camera: {
    marginBottom: 16,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(16),
    color: colors.gray,
  },
  bankIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});
