import React, {useMemo} from 'react';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {colors, icons, font} from '../../assets';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  getStatusToText,
  momentExtend,
  numberWithCommas,
} from '../../function/utility';
import * as RootNavigation from '../../navigations/RootNavigation';
import Text from '../Text';
import {useAuth} from '../../contexts/AuthContext';
import BadgeStatus from '../BadgeStatus/BadgeStatus';
import {checkDecimal} from '../../function/checkDecimal';
import {mixpanel} from '../../../mixpanel';

const MainTasklists: React.FC<any> = (props: any) => {
  const ratting = [1, 2, 3, 4, 5];
  const purposeSprayName = props.purposeSpray.purposeSprayName;
  const finishDate = new Date(
    props.finishTime?.length ? props.finishTime[0].createdAt : null,
  );
  const {
    state: {isDoneAuth},
  } = useAuth();
  const isUseDiscount = useMemo(() => {
    const isUseDiscount =
      +props.discountCoupon > 0 || +props.discountCampaignPoint > 0;
    return isUseDiscount && !isDoneAuth;
  }, [props.discountCampaignPoint, props.discountCoupon, isDoneAuth]);
  return (
    <>
      <View style={[styles.taskMenu]}>
        <View
          style={{
            padding: 16,
          }}>
          <View style={styles.listTile}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(14),
                color: '#9BA1A8',
              }}>
              #{props.id}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 4,
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: getStatusToText(props.status)?.bgcolor,
                  paddingHorizontal: normalize(8),

                  paddingVertical: normalize(5),
                  borderRadius: normalize(12),
                }}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: getStatusToText(props.status)?.color,
                    fontSize: normalize(12),
                  }}>
                  {getStatusToText(props.status)?.label}
                </Text>
              </View>
              <BadgeStatus
                status={props.status}
                statusPayment={props.statusPayment}
                style={{
                  marginLeft: 4,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              mixpanel.track('CardTask_press', {
                to: 'TaskDetailScreen',
                taskId: props.taskId,
              });
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: props.taskId, isGoBack: true},
              });
            }}>
            <View style={styles.listTile}>
              <Text
                style={{
                  color: colors.fontBlack,
                  fontFamily: fonts.medium,
                  fontSize: normalize(19),
                  width: '75%',
                }}>
                {`${purposeSprayName} (${props.title}) | ${checkDecimal(
                  props.farmArea,
                )} ไร่`}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: '#2EC66E',
                  fontSize: normalize(17),
                  marginTop: 2,
                }}>
                ฿ {props.price ? numberWithCommas(props.price) : null}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: normalize(5),
              }}>
              <Image
                source={icons.jobCard}
                style={{
                  width: normalize(20),
                  height: normalize(20),
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  paddingLeft: normalize(8),
                  fontSize: normalize(14),
                  color: colors.fontBlack,
                }}>{`${momentExtend.toBuddhistYear(
                props.date,
                'DD MMM YYYY HH:mm',
              )} น.`}</Text>
            </View>

            {props.status === 'WAIT_REVIEW' || props.status === 'DONE' ? (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingVertical: normalize(5),
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: font.medium,
                      fontSize: normalize(12),
                      color: '#3EBD93',
                    }}>
                    งานเสร็จเมื่อ
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: normalize(12),
                      color: 'black',
                    }}>{` ${momentExtend.toBuddhistYear(
                    finishDate,
                    'DD MMM YYYY HH:mm',
                  )} น.`}</Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingVertical: normalize(5),
                }}>
                <Image
                  source={icons.jobDistance}
                  style={{
                    width: normalize(20),
                    height: normalize(20),
                  }}
                />
                <View
                  style={{
                    paddingLeft: normalize(8),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: colors.fontBlack,
                      fontSize: normalize(14),
                    }}>
                    {props.address}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: '#9BA1A8',
                      fontSize: normalize(13),
                    }}>
                    ระยะทาง {numberWithCommas(props.distance)} กม.
                  </Text>
                </View>
              </View>
            )}

            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: normalize(5),
              }}>
              <Image
                source={
                  typeof props.img !== 'string'
                    ? icons.account
                    : {uri: props.img}
                }
                style={{
                  width: normalize(22),
                  height: normalize(22),
                  borderRadius: 99,
                }}
              />
              <Text
                style={{
                  color: colors.fontBlack,
                  fontFamily: fonts.medium,
                  paddingLeft: normalize(8),
                  fontSize: normalize(14),
                }}>
                {props.user}
              </Text>
            </View>
          </TouchableOpacity>

          {props.status === 'WAIT_REVIEW' ? (
            <View style={styles.borderReview}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(14),
                  color: 'black',
                }}>
                รอเกษตรกรรีวิว
              </Text>
              <View style={{flexDirection: 'row'}}>
                {ratting.map(i => (
                  <Image
                    key={i}
                    source={icons.starBorder}
                    style={{
                      width: normalize(15),
                      height: 15,
                      marginHorizontal: normalize(2),
                    }}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
        {isUseDiscount && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.disable,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 8,
            }}>
            <Image
              source={icons.requireBankBook}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.redMedium,
              }}>
              งานนี้จำเป็นต้องใช้ “ภาพถ่ายคู่บัตร” และ “บัญชีธนาคาร”
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  taskMenu: {
    backgroundColor: '#fff',
    marginHorizontal: 1,
    marginTop: 1,
    marginBottom: 10,

    shadowColor: '#242D3A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 8,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  listTile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  borderReview: {
    height: normalize(48),
    borderWidth: 1,
    borderColor: colors.greyWhite,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
  },
});

export default MainTasklists;
