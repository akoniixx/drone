import React, {useMemo, useState} from 'react';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {colors, image, icons, font} from '../../assets';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {momentExtend, numberWithCommas} from '../../function/utility';
import * as RootNavigation from '../../navigations/RootNavigation';
import {SheetManager} from 'react-native-actions-sheet';
import Modal from 'react-native-modal';
import {MainButton} from '../Button/MainButton';
import ExtendModal from '../Modal/ExtendModal';
import {mixpanel} from '../../../mixpanel';
import ModalTaskDone from '../Modal/ModalTaskDone';
import Text from '../Text';
import {useAuth} from '../../contexts/AuthContext';
import {Task} from '../../types/TaskType';
import AsyncButton from '../Button/AsyncButton';
import {checkDecimal} from '../../function/checkDecimal';

interface Props extends Task {
  onPressSetTaskId: (taskId: string) => void;
  onChangeImgFinish: (payload: any) => void;
  setDefaultRating: React.Dispatch<React.SetStateAction<number>>;
  onFinishTask: () => Promise<void>;
  onCloseSuccessModal: () => void;
  fetchTask: () => Promise<void>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  startTask: () => void;
  setShowModalStartTask: () => void;
  openModalUpload: () => void;
}
const Tasklists: React.FC<any> = (props: Props) => {
  const [toggleModalUpload, setToggleModalUpload] = useState<boolean>(false);
  const [toggleModalSuccess, setToggleModalSuccess] = useState<boolean>(false);
  const [toggleModalReview, setToggleModalReview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleModalStartTask, setToggleModalStartTask] =
    useState<boolean>(false);
  const d = new Date(props.date);
  const onChangeImgFinish = props.onChangeImgFinish;
  const onPressSetTaskId = props.onPressSetTaskId;
  const {
    state: {isDoneAuth},
  } = useAuth();
  const isUseDiscount = useMemo(() => {
    const isUseDiscount =
      +props.discountCoupon > 0 || +props.discountCampaignPoint > 0;
    return isUseDiscount && !isDoneAuth;
  }, [props.discountCampaignPoint, props.discountCoupon, isDoneAuth]);
  d.setHours(d.getHours() - 3);
  const checkdate = new Date(d);
  const today = new Date();
  const maxRatting: Array<number> = props.maxRatting;
  const defaultRating = props.defaultRating;
  const starImgFilled = props.starImgFilled;
  const starImgCorner = props.starImgCorner;

  const taskId = props.taskId;
  const statusDelay = props.statusDelay;
  const isProblem = props.isProblem;
  // const status = 'WAIT_START';
  const status = props.status;

  const [visible, setVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const ReviewBar = () => {
    return (
      <View style={styles.reviewBar}>
        {maxRatting.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={key}
              onPress={() => props.setDefaultRating(item)}>
              <Image
                style={styles.star}
                source={item <= defaultRating ? starImgFilled : starImgCorner}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <View style={styles.taskMenu}>
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: status === 'WAIT_START' ? '#D1F4FF' : '#FCE588',
              paddingHorizontal: normalize(12),
              paddingVertical: normalize(5),
              borderRadius: normalize(12),
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: status === 'WAIT_START' ? '#0B69A3' : '#B16F05',
                fontSize: normalize(12),
              }}>
              {status === 'WAIT_START' ? 'รอเริ่มงาน' : 'กำลังดำเนินการ'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: props.taskId},
            })
          }>
          <View style={styles.listTile}>
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.medium,
                fontSize: normalize(19),
              }}>
              {`${props.title} | ${checkDecimal(+props.farmArea)} ไร่`}
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: '#2EC66E',
                fontSize: normalize(17),
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

        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: normalize(10),
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              width: status === 'IN_PROGRESS' ? 'auto' : '100%',
              height: normalize(49),
              borderRadius: normalize(8),
              borderWidth: 0.5,
              borderColor: '#DCDFE3',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              maxWidth: status === 'IN_PROGRESS' ? 48 : '100%',
              flex: 1,
              marginRight: 8,
            }}
            onPress={() => {
              SheetManager.show('CallingSheet', {
                payload: {tel: props.tel},
              });
            }}>
            <Image
              source={icons.calling}
              style={{
                width: normalize(24),
                height: normalize(24),
              }}
            />
            {status === 'WAIT_START' ? (
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(19),
                  color: 'black',
                  marginLeft: 5,
                }}>
                โทร
              </Text>
            ) : null}
          </TouchableOpacity>
          {status === 'IN_PROGRESS' ? (
            <TouchableOpacity
              disabled={!!statusDelay || isProblem}
              onPress={() => {
                setVisible(true);
              }}
              style={{
                width: '100%',
                flex: 1,

                height: normalize(49),
                borderRadius: normalize(8),
                backgroundColor:
                  !!statusDelay || isProblem ? colors.disable : colors.orange,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: colors.white,
                }}>
                ขยายเวลา
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            disabled={
              (status === 'WAIT_START' && checkdate >= today) ||
              statusDelay === 'WAIT_APPROVE'
            }
            onPress={() => {
              onPressSetTaskId(props.taskId);
              if (status === 'WAIT_START') {
                props.setShowModalStartTask();
                setToggleModalStartTask(true);
              } else {
                // props.openModalUpload();
                // setToggleModalUpload(true);
                RootNavigation.navigate('Main', {
                  screen: 'FinishTaskScreen',
                  params: {
                    taskId: props.taskId,
                    taskAppointment: props.dateAppointment,
                    isFromTaskDetail: true,
                  },
                });
              }
            }}
            style={{
              width: '100%',
              flex: 1,
              height: normalize(49),
              borderRadius: normalize(8),
              backgroundColor:
                status === 'WAIT_START'
                  ? checkdate <= today
                    ? '#2BB0ED'
                    : colors.disable
                  : '#2EC66E',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontWeight: '600',
                fontSize: normalize(19),
                color: colors.white,
              }}>
              {status === 'WAIT_START' ? 'เริ่มทำงาน' : 'งานเสร็จสิ้น'}
            </Text>
          </TouchableOpacity>
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
                color: colors.fontBlack,
                fontFamily: fonts.medium,
                fontSize: normalize(14),
              }}>
              {props.preparation ? props.preparation : '-'}
            </Text>
          </View>
        </View>
        <Modal isVisible={toggleModalStartTask} backdropOpacity={0.2}>
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              padding: normalize(15),
              borderRadius: 12,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(19),
                  color: 'black',
                  marginBottom: normalize(10),
                }}>
                ยืนยันการเริ่มงาน?
              </Text>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: normalize(14),
                  color: 'black',
                  marginBottom: 15,
                }}>
                กรุณากดยืนยันหากต้องการเริ่มงานนี้
              </Text>
            </View>
            <MainButton
              label="เริ่มงาน"
              color={colors.orange}
              borderColor={colors.orange}
              fontColor="white"
              onPress={() => {
                setToggleModalStartTask(false);
                props.startTask();
              }}
            />
            <MainButton
              label="ยังไม่เริ่มงาน"
              color="white"
              borderColor={colors.gray}
              fontColor="black"
              onPress={() => setToggleModalStartTask(false)}
            />
          </View>
        </Modal>
        <ModalTaskDone
          taskId={props.taskId}
          onShowReviewModal={payload => {
            onChangeImgFinish(payload);
            setToggleModalReview(true);
          }}
          onClose={() => {
            setToggleModalUpload(false);
          }}
          visible={toggleModalUpload}
          onOpenModal={() => {
            setToggleModalUpload(true);
          }}
        />

        <Modal isVisible={toggleModalReview}>
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              padding: 16,
              borderRadius: 12,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(19),
                  color: 'black',
                  marginBottom: normalize(10),
                }}>
                ให้คะแนนรีวิว
              </Text>
            </View>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: normalize(16),
                color: 'black',
                marginBottom: 15,
              }}>
              ภาพรวมของเกษตรกร
            </Text>
            <ReviewBar />
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: normalize(16),
                color: 'black',
                marginVertical: 15,
              }}>
              ความคิดเห็นเพิ่มเติม
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: normalize(8),
                borderColor: isFocus ? colors.orange : colors.greyWhite,
                height: normalize(45),
                marginBottom: 16,
                paddingHorizontal: normalize(10),
              }}
              placeholder="กรอกความคิดเห็นเพิ่มเติม"
              onChangeText={props.setComment}
              value={props.comment}
              allowFontScaling={false}
              onBlur={() => {
                setIsFocus(false);
              }}
              onFocus={() => {
                setIsFocus(true);
              }}
            />
            <AsyncButton
              title="ยืนยัน"
              isLoading={loading}
              disabled={defaultRating == 0 || loading}
              onPress={async () => {
                mixpanel.track('Task success');
                setLoading(true);
                await props
                  .onFinishTask()
                  .then(() => {
                    setToggleModalReview(false);
                    setTimeout(() => {
                      setToggleModalSuccess(true);
                    }, 500);
                  })
                  .finally(() => {
                    setLoading(false);
                    setToggleModalReview(false);
                  });
              }}
            />
          </View>
        </Modal>

        <ExtendModal
          isVisible={visible}
          onCloseModal={() => setVisible(false)}
          taskId={taskId}
          fetchTask={props.fetchTask}
        />
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
      <Modal isVisible={toggleModalSuccess}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              รีวิวสำเร็จ
            </Text>
            <Image
              source={image.reviewSuccess}
              style={{width: normalize(170), height: normalize(168)}}
            />
          </View>
          <MainButton
            label="ตกลง"
            color={colors.orange}
            onPress={async () => {
              setToggleModalSuccess(false);
              props.onCloseSuccessModal();
              await props.fetchTask();
            }}
          />
        </View>
      </Modal>
    </View>
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
    alignItems: 'center',
    paddingVertical: 5,
  },
  g19: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  uploadFrame: {
    width: normalize(316),
    height: normalize(136),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(16),
  },
  modalBtn: {
    width: normalize(142),
    height: normalize(50),
    borderWidth: 0.2,
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewBar: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  star: {
    width: normalize(40),
    height: normalize(40),
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
});

export default Tasklists;
