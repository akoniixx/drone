import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import React, {useEffect, useMemo} from 'react';
import {colors, font, icons} from '../../assets';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import CustomHeader from '../../components/CustomHeader';
import {momentExtend, numberWithCommas} from '../../function/utility';
import Counter from '../../components/Counter/Counter';
import {normalize} from '../../function/Normalize';
import Modal from '../../components/Modal/Modal';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import {RewardListType} from '../RewardScreen/ListReward';
import {usePoint} from '../../contexts/PointContext';

import moment from 'moment';
import RenderHTML from '../../components/RenderHTML/RenderHTML';
import Text from '../../components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../contexts/AuthContext';
import {DigitalRewardType} from '../../types/TypeRewardDigital';
import {mixpanel} from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<StackParamList, 'RewardDetailScreen'>;
}
export default function RewardDetailScreen({navigation, route}: Props) {
  const {isDigital, id} = route.params;
  const {getCurrentPoint} = usePoint();
  const {
    state: {user},
    authContext: {getProfileAuth},
  } = useAuth();

  const [resultRedeemDigital, setResultRedeemDigital] =
    React.useState<DigitalRewardType>({} as DigitalRewardType);

  const width = useWindowDimensions().width - 32;
  const [counter, setCounter] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const {currentPoint} = usePoint();
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [showSuccessExchangeModal, setShowSuccessExchangeModal] =
    React.useState(false);
  const [rewardDetail, setRewardDetail] = React.useState<RewardListType>(
    {} as RewardListType,
  );

  const [disableExchange, setDisableExchange] = React.useState(false);
  const [cantExchange, setCantExchange] = React.useState(false);
  const isExpired =
    rewardDetail.expiredExchangeDate &&
    moment(rewardDetail.expiredExchangeDate).isAfter(moment());
  const requirePoint = useMemo(() => {
    if (!rewardDetail.score) {
      return 0;
    }
    return +rewardDetail.score;
  }, [rewardDetail]);
  const getRewardById = async () => {
    try {
      const result = await rewardDatasource.getRewardDetail(id);
      const resultData: RewardListType = {
        ...result,
      };
      if (resultData.score && +resultData.score > currentPoint) {
        setCounter(1);
        setCantExchange(true);
      }
      setRewardDetail(resultData);
    } catch (e) {
      console.log(e);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getRewardById();
    setRefreshing(false);
  };
  useEffect(() => {
    if (id) {
      getRewardById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onRedeemDigital = async () => {
    try {
      setDisableExchange(true);
      const dronerId = await AsyncStorage.getItem('droner_id');
      const payload: any = {
        rewardId: id,
        quantity: 1,
        dronerId,
        updateBy: `${user?.firstname} ${user?.lastname}`,
        receiverDetail: {
          firstname: user?.firstname,
          lastname: user?.lastname,
          tel: user?.telephoneNo,
        },
      };
      const result = await rewardDatasource.redeemReward(payload);
      await getCurrentPoint();
      await getProfileAuth();
      setShowSuccessExchangeModal(true);
      setResultRedeemDigital(result);
      setDisableExchange(false);
    } catch (e) {
      console.log(e);
    } finally {
      setDisableExchange(false);
    }
  };

  const isOverRemain = useMemo(() => {
    if (rewardDetail.remain) {
      return counter > rewardDetail.remain;
    }
  }, [rewardDetail.remain, counter]);
  const onPressExchange = () => {
    navigation.navigate('RedeemAddressScreen', {
      data: {
        ...rewardDetail,
        amountExchange: counter,
        usePoint: requirePoint * counter,
      },
    });
  };

  const {isLimit, isDisableMinus, isDisablePlus, disableButton} =
    useMemo(() => {
      const isDisableMinus = counter <= 1;

      const disableButton =
        counter <= 0 || counter * requirePoint > currentPoint;
      const isDisablePlus = (counter + 1) * requirePoint > currentPoint;

      return {
        isLimit: counter * requirePoint >= currentPoint,
        isDisableMinus,
        isDisablePlus,
        disableButton: disableButton,
      };
    }, [counter, currentPoint, requirePoint]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => {
          mixpanel.track('กดกลับจากหน้ารายละเอียดรีวอร์ด');
          navigation.goBack();
        }}
        headerCenter={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Image
              source={icons.ICKDronerPoint}
              style={{
                width: 30,
                height: 30,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(20),
                color: colors.fontBlack,
                textAlign: 'center',
              }}>
              {numberWithCommas(currentPoint.toString(), true)} แต้ม
            </Text>
          </View>
        }
      />
      <NetworkLost onPress={onRefresh}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <ProgressiveImage
              source={{
                uri: rewardDetail.imagePath,
              }}
              style={{
                height: width,
                width: width,
                borderRadius: 12,
              }}
            />
          </View>

          <View style={styles({disable: disableButton}).container}>
            <RenderHTML
              tagsStyles={{
                body: {
                  fontSize: 24,
                  fontFamily: font.bold,
                  color: colors.fontBlack,
                },
              }}
              contentWidth={width}
              source={{
                html: rewardDetail?.rewardName || '',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 8,
                    fontFamily: font.medium,
                  }}>
                  ใช้แต้ม {numberWithCommas(requirePoint.toString(), true)} แต้ม
                </Text>
              </View>

              {!isDigital && (
                <Counter
                  remaining={rewardDetail.remain}
                  count={counter}
                  isDisableMinus={isDisableMinus}
                  isDisablePlus={isDisablePlus}
                  setCount={count => setCounter(count)}
                  isLimit={isLimit}
                />
              )}
            </View>
            {cantExchange && (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.medium,
                  color: colors.decreasePoint,
                }}>
                แต้มสะสมของคุณไม่ถึงจำนวนที่แลกได้
              </Text>
            )}
            {/* <View style={styles({disable: disableButton}).amountContainer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.darkOrange,
              }}>
              จำนวนคงเหลือ
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              {amount}
            </Text>
          </View> */}
            {isDigital && isExpired && (
              <View
                style={{
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 62,
                  marginTop: 16,
                  backgroundColor: colors.skySoft,
                  minWidth: 180,
                  maxWidth: 200,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.skyDark,
                  }}>
                  หมดอายุอีก {moment(rewardDetail.expiredUsedDate).fromNow()}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.bold,
                    color: colors.fontBlack,
                  }}>
                  {momentExtend.toBuddhistYear(
                    rewardDetail?.expiredUsedDate?.toString() || '',
                    'DD MMM YYYY',
                  )}
                </Text>
              </View>
            )}

            <View
              style={{
                marginTop: 16,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.medium,
                  color: colors.fontBlack,
                }}>
                รายละเอียด
              </Text>
              <RenderHTML
                source={{
                  html: rewardDetail.description || '',
                }}
                contentWidth={width}
                tagsStyles={{
                  body: {
                    fontSize: 18,
                    fontFamily: font.regular,
                    color: colors.gray,
                    lineHeight: 28,
                  },
                }}
              />
            </View>
            <View
              style={{
                marginTop: 16,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.medium,
                  color: colors.fontBlack,
                }}>
                เงื่อนไข
              </Text>
              <RenderHTML
                source={{
                  html: rewardDetail.condition || '',
                }}
                contentWidth={width}
                tagsStyles={{
                  body: {
                    fontSize: 18,
                    fontFamily: font.regular,
                    color: colors.gray,
                    lineHeight: 28,
                  },
                }}
              />
            </View>

            <View
              style={{
                height: 40,
              }}
            />
          </View>
        </ScrollView>
        <View style={styles({disable: disableButton}).footer}>
          <TouchableOpacity
            disabled={disableButton || isOverRemain}
            style={styles({disable: disableButton || isOverRemain}).button}
            onPress={
              isDigital
                ? () => {
                    mixpanel.track('กดแลกแต้มแบบdigital');
                    setIsConfirm(true);
                  }
                : () => {
                    mixpanel.track('กดแลกแต้มแบบphysical');
                    onPressExchange();
                  }
            }>
            <Text style={styles({disable: disableButton}).textButton}>
              แลกแต้ม
            </Text>
          </TouchableOpacity>
        </View>
      </NetworkLost>

      <Modal
        visible={isConfirm}
        disablePrimary={disableExchange}
        onPressPrimary={async () => {
          mixpanel.track('RewardDetailScreen_ConfirmButtonDigital_press', {
            rewardId: id,
            rewardName: rewardDetail.rewardName,
            rewardType: rewardDetail.rewardType,
            rewardScore: rewardDetail.score,
            rewardAmount: counter,
          });
          setIsConfirm(false);
          await onRedeemDigital();
        }}
        title={'ยืนยันการแลกแต้ม'}
        onPressSecondary={() => {
          mixpanel.track('RewardDetailScreen_CancelButtonDigital_press');
          setIsConfirm(false);
        }}
        subTitle={'ท่านต้องการยืนยันการแลกแต้มหรือไม่'}
      />
      <Modal
        showClose
        onClose={() => {
          mixpanel.track('RewardDetailScreen_SuccessExchangeModal_close');
          setShowSuccessExchangeModal(false);
        }}
        iconTop={
          <Image
            source={icons.successIcon}
            style={{width: 42, height: 42, marginBottom: 16}}
          />
        }
        visible={showSuccessExchangeModal}
        onPressPrimary={() => {
          mixpanel.track('RewardDetailScreen_SuccessExchangeModal_press', {
            to: 'RedeemScreen',
          });
          setShowSuccessExchangeModal(false);
          navigation.navigate('RedeemScreen', {
            data: resultRedeemDigital,
            imagePath: rewardDetail.imagePath,
            expiredUsedDate: rewardDetail.expiredUsedDate,
          });
        }}
        onPressSecondary={() => {
          mixpanel.track('กดยังไม่ใช้คูปองหลังจากแลกรางวัล');
          setShowSuccessExchangeModal(false);
          navigation.navigate('MyRewardScreen', {
            tab: 'readyToUse',
          });
        }}
        title={'แลกแต้มสำเร็จ'}
        subTitle={'คูปองพร้อมใช้งานแล้ว'}
        titlePrimary="ใช้คูปองทันที"
        titleSecondary="ยังไม่ใช้ ดูรีวอร์ดของฉัน >"
      />
    </SafeAreaView>
  );
}

const styles = ({disable}: {disable?: boolean}) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    amountContainer: {
      paddingTop: 8,
      paddingLeft: 16,
      paddingRight: 40,
      backgroundColor: colors.orangeSoft,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    footer: {
      height: 100,
      backgroundColor: colors.white,

      flexDirection: 'row',
      padding: 16,
      elevation: 8,
      shadowColor: '#242D35',
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowOpacity: 0.04,
      shadowRadius: 16,
    },
    textButton: {
      fontSize: 18,
      fontFamily: font.bold,
      color: colors.white,
    },
    button: {
      width: '100%',
      backgroundColor: disable ? colors.disable : colors.orange,
      borderRadius: 12,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: disable ? colors.disable : '#F86820',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    subButton: {
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: 12,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
  });
