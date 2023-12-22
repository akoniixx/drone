import {View, Modal, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useMemo} from 'react';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import Text from '../Text';
import moment from 'moment';
import AsyncButton from '../Button/AsyncButton';
import icons from '../../assets/icons/icons';
import TimePicker from '../TimePicker/TimePicker';

type Props = {
  placeholder?: string;
  label?: string;
  onChange: (v: {hour: number; minute: number}) => void;
  value: {hour: number; minute: number};
};

const TimeInputFarmer = ({placeholder, onChange, value, label}: Props) => {
  const [openCalendar, setOpenCalendar] = React.useState(false);

  const timeFormat = useMemo(() => {
    if (!value) {
      return;
    }
    return moment().hour(value.hour).minute(value.minute).format('HH:mm');
  }, [value]);

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
        {timeFormat ? (
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.regular,
              fontSize: normalize(16),
            }}>
            {timeFormat}
          </Text>
        ) : (
          <Text>{placeholder}</Text>
        )}
        <Image
          source={icons.timeGrey}
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
              เวลานัดหมาย
            </Text>

            <View>
              <TimePicker
                hour={value.hour}
                minute={value.minute}
                setHour={hour => {
                  onChange({...value, hour: hour});
                }}
                setMinute={minute => {
                  onChange({...value, minute: minute});
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
export default TimeInputFarmer;
