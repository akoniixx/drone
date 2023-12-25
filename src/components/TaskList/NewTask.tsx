import React, {useEffect, useMemo, useState} from 'react';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {colors, image, icons} from '../../assets';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {momentExtend, numberWithCommas} from '../../function/utility';
import {useNavigation} from '@react-navigation/native';
import {mixpanel} from '../../../mixpanel';
import {useAuth} from '../../contexts/AuthContext';
import {checkDecimal} from '../../function/checkDecimal';
import Text from '../Text';

const NewTask: React.FC<any> = (props: any) => {
  const onPressReceiveTask = props.receiveTask;

  const navigation = useNavigation<any>();
  const {taskId, fetchData} = props;
  const {
    state: {isDoneAuth},
  } = useAuth();
  const isUseDiscount = useMemo(() => {
    const isUseDiscount =
      +props.discountCoupon > 0 || +props.discountCampaignPoint > 0;
    return isUseDiscount && !isDoneAuth;
  }, [props.discountCampaignPoint, props.discountCoupon, isDoneAuth]);

  const expire = new Date(new Date(props.updatedAt).getTime() + 30 * 60 * 1000);
  const now = new Date();
  const diff = new Date(expire.getTime() - now.getTime());
  const [minutes, setMinutes] = useState(diff.getMinutes());
  const [seconds, setSeconds] = useState(diff.getSeconds());
  useEffect(() => {
    let interval = setInterval(async () => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          fetchData();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <TouchableOpacity
      style={styles.taskMenu}
      activeOpacity={1}
      onPress={() => {
        mixpanel.track('View detail task from new task list');
        navigation.navigate('TaskDetailScreen', {taskId});
      }}>
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
            {props.taskNo}
          </Text>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FF981E',
              paddingHorizontal: normalize(12),
              paddingVertical: normalize(5),
              borderRadius: normalize(12),
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: '#FFFFFF',
                fontSize: normalize(12),
              }}>
              งานใหม่
            </Text>
          </View>
        </View>
        <View style={styles.listTile}>
          <Text
            numberOfLines={2}
            style={{
              color: colors.fontBlack,
              fontFamily: fonts.medium,
              fontSize: normalize(19),
              width: '75%',
            }}>
            {`${props.purposeSpray.purposeSprayName} (${
              props.title
            })  | ${checkDecimal(+props.farmArea)} ไร่`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: '#2EC66E',
              fontSize: normalize(17),
              marginTop: 2,
            }}>
            ฿{' '}
            {props.price
              ? numberWithCommas(props.price.toString() || '')
              : null}
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
                fontSize: normalize(14),
                color: colors.fontBlack,
              }}>
              {props.address}
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: '#9BA1A8',
                fontSize: normalize(13),
              }}>
              ระยะทาง {props.distance} กม.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(5),
          }}>
          <Image
            source={
              typeof props.img !== 'string' ? icons.account : {uri: props.img}
            }
            style={{
              width: normalize(20),
              height: normalize(20),
              borderRadius: normalize(99),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              paddingLeft: normalize(8),
              fontSize: normalize(14),
              color: colors.fontBlack,
            }}>
            {props.user}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(10),
          }}>
          <TouchableOpacity
            style={{
              width: '48%',
              height: normalize(49),
              borderRadius: normalize(8),
              borderWidth: normalize(1),
              borderColor: '#DCDFE3',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              mixpanel.track('View detail task from new task list');
              navigation.navigate('TaskDetailScreen', {taskId});
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontWeight: '600',
                fontSize: normalize(19),
                color: '#242D35',
              }}>
              ดูรายละเอียด
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '48%',
              height: normalize(49),
              borderRadius: normalize(8),
              backgroundColor: '#2EC66E',
              display: 'flex',
              flexDirection: 'row',
            }}
            onPress={() => {
              mixpanel.track('Accept task from new task list');
              onPressReceiveTask();
            }}>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  paddingLeft: '10%',
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: '#ffffff',
                  textAlign: 'left',
                  left: '10%',
                }}>
                รับงาน
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  padding: '4%',
                  backgroundColor: '#014D40',
                  width: '85%',
                  borderRadius: 39,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontWeight: '600',
                    fontSize: normalize(19),
                    color: '#ffffff',
                    textAlign: 'center',
                  }}>
                  {minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              width: normalize(127.5),
              height: normalize(49),
              borderRadius: normalize(8),
              backgroundColor:
                props.status === 'WAIT_START' ? '#2BB0ED' : '#2EC66E',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontWeight: '600',
                fontSize: normalize(19),
                color: '#fff',
              }}>
              {props.status === 'WAIT_START' ? 'เริ่มทำงาน' : 'งานเสร็จสิ้น'}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(5),
          }}>
          <Image
            source={icons.note}
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
                fontSize: normalize(14),
                color: colors.fontBlack,
              }}>
              {props.comment}
            </Text>
          </View>
        </View>
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
    </TouchableOpacity>
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
});

export default NewTask;
