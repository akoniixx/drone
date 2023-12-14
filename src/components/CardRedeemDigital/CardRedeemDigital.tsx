import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {font, image} from '../../assets';
import colors from '../../assets/colors/colors';
import {DigitalRewardType} from '../../types/TypeRewardDigital';
import DashedLine from 'react-native-dashed-line';
import {useAuth} from '../../contexts/AuthContext';
import {momentExtend} from '../../function/utility';
import Text from '../Text';
import moment from 'moment';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';
const mappingStatusText = {
  REQUEST: 'พร้อมใช้',
  USED: 'ใช้แล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  USED: colors.green,
  EXPIRED: colors.grayPlaceholder,
  CANCEL: colors.decreasePoint,
};
interface Props {
  imagePath: string;
  data: DigitalRewardType;
  expiredUsedDate: string;
}
export default function CardRedeemDigital({
  imagePath,
  data,
  expiredUsedDate,
}: Props) {
  const isExpired = React.useMemo(() => {
    return moment(expiredUsedDate).isBefore(moment());
  }, [expiredUsedDate]);
  const isUsed = React.useMemo(() => {
    return data?.dronerTransaction?.redeemDetail?.redeemStatus === 'USED';
  }, [data]);
  const isCancel = React.useMemo(() => {
    return data?.dronerTransaction?.redeemDetail?.redeemStatus === 'CANCEL';
  }, [data]);
  const isRequest = React.useMemo(() => {
    return (
      data?.dronerTransaction?.dronerRedeemHistories?.[0].status ===
        'REQUEST' && data?.dronerTransaction?.dronerRedeemHistories.length === 1
    );
  }, [data]);
  const usedData = React.useMemo(() => {
    return data?.dronerTransaction?.dronerRedeemHistories?.find(
      item => item.status === 'USED',
    );
  }, [data]) || {createAt: ''};
  const {
    state: {user},
  } = useAuth();

  if (!data) {
    return <View />;
  }
  return (
    <>
      <View style={styles.card}>
        <View
          style={{
            flex: 0.2,
          }}>
          <ProgressiveImage
            source={{
              uri: imagePath,
            }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
            marginLeft: 24,
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 72,
          }}>
          <View
            style={{
              minHeight: 72,
            }}>
            <Text
              numberOfLines={3}
              style={{
                fontSize: 16,
                fontFamily: font.bold,
              }}>
              {data?.dronerTransaction?.rewardName}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontFamily: font.light,
              }}>
              สถานะ :{' '}
              <Text
                style={{
                  fontFamily: font.bold,
                  color:
                    mappingStatusColor[
                      data.dronerTransaction.redeemDetail
                        .redeemStatus as keyof typeof mappingStatusColor
                    ],
                }}>
                {
                  mappingStatusText[
                    data.dronerTransaction.redeemDetail
                      .redeemStatus as keyof typeof mappingStatusText
                  ]
                }
              </Text>
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              flex: 0.2,
              alignItems: 'flex-end',
            }}>
            <Image
              source={icons.arrowRight}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <DashedLine
        dashLength={14}
        dashGap={4}
        dashColor={colors.grey3}
        style={{
          marginHorizontal: 10,
        }}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
            }}>
            หมดอายุการใช้{' '}
            {momentExtend.toBuddhistYear(expiredUsedDate, 'DD MMM YYYY ')}
          </Text>
        </View>
        {isUsed ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.usedBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                opacity: 0.2,
                fontFamily: font.bold,
              }}>
              {data.dronerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : isExpired ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.expiredBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                color: colors.softGrey2,
              }}>
              {data.dronerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : isCancel ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.cancelBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                opacity: 0.2,
                fontFamily: font.bold,
              }}>
              {data.dronerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 32,
              fontFamily: font.bold,
            }}>
            {data.dronerTransaction.redeemDetail.digitalReward.redeemCode}
          </Text>
        )}

        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
              }}>
              แลกโดย
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {isRequest ? 'แลกเมื่อ' : 'ใช้เมื่อ'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {user?.telephoneNo}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {momentExtend.toBuddhistYear(
                  isRequest
                    ? data.dronerTransaction.dronerRedeemHistories[0].createAt
                    : usedData?.createAt,
                  'DD MMM YYYY HH:mm',
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 42,
              width: '100%',
              justifyContent: 'center',
              backgroundColor: colors.orangeSoft,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              paddingHorizontal: 16,
            }}>
            <Text
              style={{
                fontFamily: font.medium,
                color: colors.darkOrange2,
                fontSize: 14,
              }}>
              รหัสการทำรายการ {data.dronerTransaction.redeemNo}
            </Text>
          </View>
        </View>
      </View>

      {isCancel && data.dronerTransaction.redeemDetail.remark && (
        <Text
          style={{
            marginTop: 8,
            paddingHorizontal: 16,
            alignSelf: 'flex-start',
            flex: 1,
            fontSize: 14,
          }}>
          หมายเหตุ : {data.dronerTransaction.redeemDetail.remark}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
