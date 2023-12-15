import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal as ModalRN,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal/dist/modal';
import Toast from 'react-native-toast-message';

import {normalize} from '../../function/Normalize';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import CalendarCustom from '../../components/Calendar/Calendar';
import dayjs from 'dayjs';
import InputTime from '../InputTime/InputTime';
import TextInputArea from '../TextInputArea/TextInputArea';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {momentExtend} from '../../function/utility';
import Text from '../Text';
import {mixpanel} from '../../../mixpanel';

interface Props {
  isVisible: boolean;
  onCloseModal: () => void;
  taskId?: string;
  fetchTask: () => Promise<void>;
}
const ExtendModal = ({
  isVisible,
  onCloseModal,
  fetchTask,
  taskId = '',
}: Props): JSX.Element => {
  const [date, setDate] = React.useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
    day: dayjs().date(),
    dateString: '',
  });

  const [time, setTime] = React.useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const isDisabled = !date.dateString || !time || !note;
  const onSubmit = async () => {
    try {
      const newDate = dayjs(date.dateString)
        .hour(dayjs(time).hour())
        .minute(dayjs(time).minute());

      const res = await TaskDatasource.onExtendTaskRequest({
        dateDelay: newDate.toISOString(),
        delayRemark: note,
        taskId,
      });

      if (res) {
        await fetchTask();
      }
      mixpanel.track('extendTask', {
        taskId,
        dateDelay: newDate.toISOString(),
        delayRemark: note,
      });
      Toast.show({
        type: 'taskExtendReqSuccess',
        text1: `งาน #${taskId}`,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Modal isVisible={isVisible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                fontSize: normalize(18),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ขยายเวลาพ่น
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.darkOrange,
                borderRadius: 16,
                padding: 10,
                width: '100%',
                backgroundColor: '#FFF7F4',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                <Image
                  source={icons.warningIcon}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: normalize(14),
                      color: 'black',
                    }}>
                    เงื่อนไขการขยายเวลาพ่น
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: normalize(12),
                      color: colors.darkOrange,
                      textAlign: 'left',
                    }}>
                    หากจำเป็นต้องขยายเวลาพ่น กรุณากรอกข้อมูล
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: normalize(12),
                      color: colors.darkOrange,
                      textAlign: 'left',
                    }}>
                    วันเสร็จสิ้น และเวลาเพื่อเป็นการคอนเฟิรม์ระบบ
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: normalize(12),
                      color: colors.darkOrange,
                      textAlign: 'left',
                    }}>
                    และเจ้าหน้าที่ตรวจสอบอีกครั้ง
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                alignItems: 'flex-start',
                marginTop: 10,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: normalize(16),
                  color: colors.fontBlack,
                }}>
                วันเสร็จสิ้นการพ่น
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: '100%',
                padding: normalize(5),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.grayPlaceholder,
              }}
              onPress={() => setIsOpen(true)}>
              {!date?.dateString ? (
                <Text
                  style={{
                    fontFamily: font.medium,

                    fontSize: normalize(16),
                    color: colors.grayPlaceholder,
                  }}>
                  เลือกวัน/เดือน/ปี
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(16),
                    color: colors.inputText,
                  }}>
                  {date.dateString
                    ? momentExtend.toBuddhistYear(
                        date.dateString,
                        'DD MMM YYYY',
                      )
                    : ''}
                </Text>
              )}
              <Image
                source={icons.jobCard}
                style={{
                  width: normalize(25),
                  height: normalize(30),
                }}
              />
            </TouchableOpacity>

            <InputTime
              value={time}
              onChange={t => {
                setTime(t);
              }}
              label={'เวลาเสร็จสิ้นการพ่น'}
            />

            <TextInputArea
              label="เหตุผลการขยายเวลา"
              onChangeText={txet => {
                setNote(txet);
              }}
              value={note}
            />
            <ModalRN
              visible={isOpen}
              transparent={true}
              style={{
                borderRadius: 16,
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    borderRadius: normalize(8),
                    backgroundColor: colors.white,
                    width: Dimensions.get('screen').width * 0.9,
                    padding: normalize(20),
                  }}>
                  <CalendarCustom
                    disablePast
                    enableOneWeek
                    value={date.dateString}
                    onHandleChange={v => {
                      setDate(v);
                      setIsOpen(false);
                    }}
                  />
                </View>
              </View>
            </ModalRN>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={onCloseModal}
                style={[
                  styles.button,
                  {
                    width: '48%',
                    borderColor: colors.grayPlaceholder,
                  },
                ]}>
                <Text style={styles.textButton}>ปิด</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                  onCloseModal();
                }}
                disabled={isDisabled}
                style={[
                  styles.button,
                  {
                    width: '48%',
                    borderWidth: 0,

                    backgroundColor: isDisabled
                      ? colors.disable
                      : colors.orange,
                  },
                ]}>
                <Text
                  style={[
                    styles.textButton,
                    {
                      color: colors.white,
                    },
                  ]}>
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ExtendModal;
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
    padding: normalize(10),
  },
  textButton: {
    fontFamily: font.medium,
    fontSize: normalize(18),
  },
});
