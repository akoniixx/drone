import {View, Modal, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import Text from '../Text';
import moment from 'moment';
import DatePickerCustom from '../DatePickerCustom/DatePickerCustom';
import AsyncButton from '../Button/AsyncButton';
import {momentExtend} from '../../function/utility';
import icons from '../../assets/icons/icons';

type Props = {
  placeholder?: string;
};

const DateInputFarmer = ({placeholder}: Props) => {
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setOpenCalendar(true);
        }}>
        {date ? (
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.light,
              fontSize: normalize(18),
            }}>
            {momentExtend.toBuddhistYear(date, 'DD/MM/YYYY')}
          </Text>
        ) : (
          <Text>{placeholder}</Text>
        )}
        {/* <Image source={icons.cal} /> */}
      </TouchableOpacity>
      <Modal transparent={true} visible={openCalendar} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: normalize(20),
              backgroundColor: colors.white,
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: normalize(8),
            }}>
            <Text
              style={[
                {
                  textAlign: 'center',
                  color: colors.fontBlack,
                },
              ]}>
              วันที่ฉีดพ่น
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.fontBlack,
                fontFamily: font.light,
                fontSize: normalize(18),
                marginTop: normalize(4),

                lineHeight: normalize(30),
              }}>
              เลื่อนขึ้นลงเพื่อเลือกวันฉีดพ่น
            </Text>
            <View>
              <DatePickerCustom
                value={date}
                startDate={moment().add(0, 'days').startOf('day').toDate()}
                startYear={moment().get('year') + 543}
                endYear={moment().add(1, 'year').get('year') + 543}
                onHandleChange={(d: Date) => {
                  setDate(d);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <AsyncButton
                title="ยกเลิก"
                onPress={() => {
                  setOpenCalendar(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey3,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
  },
});
export default DateInputFarmer;
