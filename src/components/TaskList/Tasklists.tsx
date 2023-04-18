import React, {useEffect, useState} from 'react';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {colors, image, icons, font} from '../../assets';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {numberWithCommas} from '../../function/utility';
import * as RootNavigation from '../../navigations/RootNavigation';
import {SheetManager} from 'react-native-actions-sheet';
import Modal from 'react-native-modal';
import {MainButton} from '../Button/MainButton';
import ExtendModal from '../Modal/ExtendModal';
import {mixpanel} from '../../../mixpanel';

const Tasklists: React.FC<any> = (props: any) => {
  const date = new Date(props.date);
  const d = new Date(props.date);
  d.setHours(d.getHours() - 3);
  const checkdate = new Date(d);
  const today = new Date();
  const maxRatting: Array<number> = props.maxRatting;
  const defaultRating = props.defaultRating;
  const starImgFilled = props.starImgFilled;
  const starImgCorner = props.starImgCorner;
  const imgUploaded = props.imgUploaded;
  const finishImg = props.finishImg;
  const toggleModalReview = props.toggleModalReview;
  const toggleModalSuccess = props.toggleModalSuccess;
  const taskId = props.taskId;
  const statusDelay = props.statusDelay;
  const isProblem = props.isProblem;

  const [visible, setVisible] = useState(false);

  const ReviewBar = () => {
    return (
      <View style={styles.reviewBar}>
        {maxRatting.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={item}
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
            backgroundColor:
              props.status === 'WAIT_START' ? '#D1F4FF' : '#FCE588',
            paddingHorizontal: normalize(12),
            paddingVertical: normalize(5),
            borderRadius: normalize(12),
          }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: props.status === 'WAIT_START' ? '#0B69A3' : '#B16F05',
              fontSize: normalize(12),
            }}>
            {props.status === 'WAIT_START' ? 'รอเริ่มงาน' : 'กำลังดำเนินการ'}
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
            {`${props.title} | ${props.farmArea} ไร่`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: '#2EC66E',
              fontSize: normalize(17),
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
            }}>{`${date.getDate()}/${date.getMonth() + 1}/${
            date.getFullYear() + 543
          },${date.getHours()}:${date.getMinutes()} น.`}</Text>
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
        }}>
        <TouchableOpacity
          style={{
            width: normalize(props.status === 'WAIT_START' ? 155 : 49),
            height: normalize(49),
            borderRadius: normalize(8),
            borderWidth: 0.5,
            borderColor: '#DCDFE3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
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
          {props.status === 'WAIT_START' ? (
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
        {props.status === 'IN_PROGRESS' ? (
          <TouchableOpacity
            disabled={!!statusDelay || isProblem}
            onPress={() => {
              setVisible(true);
            }}
            style={{
              width: normalize(127.5),
              height: normalize(49),
              borderRadius: normalize(8),
              // eslint-disable-next-line no-extra-boolean-cast
              backgroundColor:
                !!statusDelay || isProblem ? colors.disable : colors.orange,
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
              ขยายเวลา
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          disabled={
            (props.status === 'WAIT_START' && checkdate >= today) ||
            statusDelay === 'WAIT_APPROVE'
          }
          onPress={() =>
            props.status === 'WAIT_START'
              ? props.setShowModalStartTask()
              : props.setToggleModalUpload()
          }
          style={{
            width: normalize(props.status === 'WAIT_START' ? 155 : 127.5),
            height: normalize(49),
            borderRadius: normalize(8),
            backgroundColor:
              props.status === 'WAIT_START'
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
            {props.status === 'WAIT_START' ? 'เริ่มทำงาน' : 'งานเสร็จสิ้น'}
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
      <Modal isVisible={props.toggleModalStartTask} backdropOpacity={0.2}>
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
            onPress={props.startTask}
          />
          <MainButton
            label="ยังไม่เริ่มงาน"
            color="white"
            borderColor={colors.gray}
            fontColor="black"
            onPress={() => props.setToggleModalStartTask(false)}
          />
        </View>
      </Modal>
      <Modal isVisible={props.toggleModalUpload}>
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
              คุณต้องการเสร็จสิ้นการพ่น
            </Text>
            <Text style={styles.g19}>กรุณาตรวจสอบการพ่นและการบินโดรน</Text>
            <Text style={styles.g19}>
              หน้างานเสมอ โดยเจ้าหน้าที่จะทำการติดต่อสอบถาม
            </Text>
            <Text style={styles.g19}>เกษตรกรและคุณเพื่อความสมบูรณ์ของงาน</Text>
            {imgUploaded && finishImg !== null ? (
              <View style={[styles.uploadFrame]}>
                <Image
                  source={{uri: finishImg.assets[0].uri}}
                  style={{
                    width: normalize(316),
                    height: normalize(136),
                    borderRadius: 12,
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.orange,
                    padding: 10,
                    borderRadius: 99,
                    position: 'absolute',
                  }}
                  onPress={props.onAddImage}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: normalize(14),
                      color: 'white',
                    }}>
                    เปลี่ยนรูป
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.uploadFrame,
                  {
                    borderStyle: 'dotted',
                    borderColor: colors.orange,
                    borderWidth: 2,
                    borderRadius: 12,
                    backgroundColor: colors.grayBg,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: normalize(14),
                    color: 'black',
                  }}>
                  อัพโหลดภาพงาน
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.orange,
                    padding: 10,
                    borderRadius: 99,
                    marginTop: 10,
                  }}
                  onPress={props.onAddImage}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: normalize(14),
                      color: 'white',
                    }}>
                    เปลี่ยนรูป
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(20),
            }}>
            <TouchableOpacity
              style={[styles.modalBtn, {borderColor: colors.gray}]}
              onPress={props.closeFinishModal}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(19),
                  color: 'black',
                }}>
                ปิด
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                {
                  backgroundColor: imgUploaded
                    ? colors.orange
                    : colors.greyWhite,
                  borderColor: imgUploaded ? colors.orange : colors.greyWhite,
                },
              ]}
              onPress={props.onChangImgFinish}
              disabled={!imgUploaded}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(19),
                  color: 'white',
                }}>
                ยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={toggleModalReview}>
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
              borderColor: colors.greyWhite,
              height: normalize(45),
            }}
            placeholder="กรอกความคิดเห็นเพิ่มเติม"
            onChangeText={props.setComment}
            value={props.comment}
          />
          <MainButton
            label="ยืนยัน"
            color={colors.orange}
            disable={defaultRating == 0}
            onPress={() => {
              mixpanel.track('Task success');
              props.onFinishTask(taskId);
            }}
          />
        </View>
      </Modal>
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
            onPress={props.onCloseSuccessModal}
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
  );
};

const styles = StyleSheet.create({
  taskMenu: {
    backgroundColor: '#fff',
    padding: normalize(15),
    marginVertical: normalize(5),
  },
  listTile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  g19: {
    fontFamily: font.light,
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
