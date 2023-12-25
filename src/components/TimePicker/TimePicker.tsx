import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import Text from '../Text';
import {font} from '../../assets';

const hourList = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];
const minuteList = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
];
interface Prop {
  hour: number;
  minute: number;
  setHour: (h: number) => void;
  setMinute: (m: number) => void;
}

const TimePicker: React.FC<Prop> = ({setHour, setMinute, hour, minute}) => {
  const height = 0;
  const dHeight = height / 2;
  const pickerHeight: number = Math.round(Dimensions.get('window').height / 4);
  const pickerWidth: number | string = 0 || '100%';

  const mHeight: number = Math.min(dHeight, 65);

  const findIndexHour = hourList.findIndex(el => el === hour);
  const findIndexMinute = minuteList.findIndex(el => el === minute);
  const dataList = [hourList, minuteList].map((el, index) => {
    return {
      name: index === 0 ? 'hour' : 'minute',
      value: index === 0 ? hour : minute,
      digits: el,
    };
  });
  return (
    <View style={[styles.picker, {height: pickerHeight, width: pickerWidth}]}>
      {dataList.map((el, index: number) => {
        return (
          <TimeBlock
            isLast={index === dataList.length - 1}
            digits={el.name === 'hour' ? hourList : minuteList}
            value={el.value}
            onHandleChange={(type: string, value: number) => {
              if (type === 'hour') {
                setHour(value);
              } else {
                setMinute(value);
              }
            }}
            height={pickerHeight}
            type={el.name}
            key={index}
            currentIndex={el.name === 'hour' ? findIndexHour : findIndexMinute}
          />
        );
      })}
    </View>
  );
};

const TimeBlock = ({
  digits,
  type,
  onHandleChange,
  height,
  fontSize,
  textColor,
  markHeight,
  currentIndex,
  isLast,
}: {
  value: number;
  digits: number[];
  type: string;
  isLast: boolean;
  onHandleChange: (type: string, value: number) => void;
  height: number;
  fontSize?: number;
  textColor?: string;
  markHeight?: number;
  markWidth?: number;
  currentIndex: number;
}) => {
  const dHeight: number = Math.round(height / 3);
  const scrollRef = useRef<any>(null);
  const mHeight: number = markHeight || Math.min(dHeight, 65);

  const snapScrollToIndex = (index: number) => {
    scrollRef?.current?.scrollTo({y: dHeight * index, animated: true});
  };
  const offsets = digits.map((_: any, index: number) => index * dHeight);
  const handleMomentumScrollEnd = ({nativeEvent}: any) => {
    const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
    onHandleChange(type, digit);
  };
  useEffect(() => {
    setTimeout(() => {
      snapScrollToIndex(currentIndex);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.block}>
      <View
        style={[
          styles.mark,
          {
            top: (height - mHeight) / 2,
            height: mHeight,
            width: normalize(130),
          },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.scroll}
        snapToOffsets={offsets}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={0}>
        {digits.map((value, valIndex: any) => {
          return (
            <TouchableOpacity
              key={valIndex}
              onPress={() => {
                onHandleChange(type, digits[valIndex]);
                snapScrollToIndex(valIndex);
              }}>
              <Text
                style={[
                  styles.digit,
                  {
                    fontSize: fontSize || 20,
                    color: textColor || '#000000',
                    opacity: currentIndex === valIndex ? 1 : 0.25,

                    marginBottom:
                      valIndex === digits.length - 1
                        ? height / 2 - dHeight / 2
                        : 0,
                    marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
                    lineHeight: dHeight,
                    height: dHeight,

                    fontFamily: font.medium,
                  },
                ]}>
                {value < 10 ? `0${value}` : value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!isLast && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
            }}>
            :
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  digit: {
    fontSize: 20,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: colors.disable,
    borderTopColor: colors.disable,
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scroll: {
    width: 50,
  },
  picker: {
    flexDirection: 'row',
    width: '100%',
  },
});
export default TimePicker;
