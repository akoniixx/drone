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
  date: Date | undefined;
  setDate: (v: Date) => void;
  label?: string;
};

const DateInputFarmer = ({placeholder, date, setDate, label}: Props) => {
  const [openCalendar, setOpenCalendar] = React.useState(false);
  return (
    <>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.medium,
            marginBottom: normalize(4),
          }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setOpenCalendar(true);
        }}>
        {date ? (
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.regular,
              fontSize: normalize(16),
            }}>
            {momentExtend.toBuddhistYear(date, 'DD/MM/YYYY')}
          </Text>
        ) : (
          <Text>{placeholder}</Text>
        )}
        <Image
          source={icons.CalendarGrey}
          style={{
            width: normalize(24),
            height: normalize(24),
          }}
        />
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
                  fontSize: 20,
                  fontFamily: font.bold,
                },
              ]}>
              วันนัดหมาย
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
                type="secondary"
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  setOpenCalendar(false);
                }}
              />
              <View
                style={{
                  width: 16,
                }}
              />
              <AsyncButton
                style={{
                  flex: 1,
                }}
                title="ตกลง"
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
    marginBottom: normalize(16),
  },
});
export default DateInputFarmer;
